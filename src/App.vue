<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col cols="12" sm="3">
          <v-select
            v-model="selectedCategory"
            :items="Object.keys(categories)"
            dense
            label="I need a/an"
            variant="underlined"
            required
          ></v-select>
        </v-col>
        <v-col cols="12" sm="3" v-for="(param, index) in selectedParameters" :key="index">
          <v-select
            v-model="selectedOptions[index]"
            :items="param.options"
            :label="getLabel(param.name)"
            variant="underlined"
            required
            :multiple="isMultipleSelect(param.name)"
            chips
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-btn color="primary" @click="calculateQuotation">Calculate Quotation</v-btn>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12">
          <div v-if="quotation !== null">
            <h3>Your quotation: {{ quotation }}</h3>
          </div>
        </v-col>
      </v-row>

    </v-container>
  </v-app>
</template>

<script>
import jsonData from './categories.json';

export default {
  data() {
    return {
      categories: jsonData,
      selectedCategory: null,
      selectedOptions: [],
      selectedParameters: [],
      quotation: null,
      //selectedInternalCategory: null
    };
  },
  watch: {
    selectedCategory(newValue) {
      if (newValue) {
        const parameters = this.categories[newValue].parameters.map(parameter => ({
          name: parameter.name,
          options: parameter.options.map(option => option.name),
        }));
        this.selectedParameters = parameters;
        this.selectedOptions = Array(parameters.length).fill([]);
      } else {
        this.selectedParameters = [];
        this.selectedOptions = [];
      }
    },
  },
  methods: {
    getLabel(name) {
      if (this.selectedCategory) {
        const parameter = this.categories[this.selectedCategory].parameters.find(param => param.name === name);
        if (parameter) {
          return parameter.label || parameter.name;
        }
      }
      return '';
    },
    isMultipleSelect(parameterName) {
      const multipleSelectParameters = [
        'Functionality',
        'Integrations',
        'Features',
        'Modules',
        'Platform',
        'Product Customization',
        'User Management',
        'Design and Layout',
        'Features and Functionality',
        'Security and Privacy',
        'Integration and Scalability',
      ];
      return multipleSelectParameters.includes(parameterName);
    },
    calculateQuotation() {
  console.log('Calculating quotation...');
  console.log('Selected Category:', this.selectedCategory);
  console.log('Selected Options:', this.selectedOptions);

  if (this.selectedCategory) {
    const category = this.categories[this.selectedCategory];
    console.log('Category:', category);

    let totalPrice = parseFloat(category.basePrice);
    const parameters = category.parameters;

    for (const parameter of parameters) {
      if (parameter.price) {
        totalPrice += parseFloat(parameter.price);
      } else if (parameter.multiplier) {
        totalPrice *= parseFloat(parameter.multiplier);
      }
    }

    for (let i = 0; i < this.selectedOptions.length; i++) {
      const selected = this.selectedOptions[i];
      if (Array.isArray(selected)) {
        for (const optionName of selected) {
          const parameter = parameters.find((param) => param.name === this.selectedParameters[i].name);
          if (parameter) {
            const option = parameter.options.find((opt) => opt.name === optionName);
            if (option) {
              if (option.price) {
                totalPrice += parseFloat(option.price);
              } else if (option.multiplier) {
                totalPrice *= parseFloat(option.multiplier);
              }
            }
          }
        }
      } else {
        const parameter = parameters.find((param) => param.name === this.selectedParameters[i].name);
        if (parameter) {
          const option = parameter.options.find((opt) => opt.name === selected);
          if (option) {
            if (option.price) {
              totalPrice += parseFloat(option.price);
            } else if (option.multiplier) {
              totalPrice *= parseFloat(option.multiplier);
            }
          }
        }
      }
    }

    const lowerBound = totalPrice * 0.8;
    const upperBound = totalPrice * 1.2;

   // Format the result without decimals and in EUR currency
    const formattedLowerBound = lowerBound.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    const formattedUpperBound = upperBound.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    this.quotation = `${formattedLowerBound} - ${formattedUpperBound}`;

    console.log('Total Price:', totalPrice);
    console.log('Quotation:', this.quotation);
  }
}

  },
};
</script>
