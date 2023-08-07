<style scoped>
h4.title-style {
color: #333;
font-family: Montserrat;
font-size: 36px;
font-style: normal;
font-weight: 500;
line-height: normal;
}


.v-row {
  display: flex;
  align-items: center;
}


/* Target the root element */
.v-select {
color: #0397FB;
/* display: inline-block; */
font-size: 22px;
font-weight: 500;

}


.mySelect::v-deep .v-chip {
display: flex;
padding: 0.65rem;
border-radius: 6px;
justify-content: center;
margin: 0px 3px 3px 0px;
align-items: center;
color: var(--blue-light, #0397FB);
font-family: Montserrat, sans-serif; /* Montserrat font family */  
font-size: 11px;
font-style: normal;
font-weight: 500;
}

.select-container {
align-items: center; 
/* padding: 1em 1em 1em 1em; */
display:flex;
color: #333;
font-family: Montserrat, sans-serif; /* Montserrat font family */  
font-size: 22px;
font-style: normal;
font-weight: 300;
line-height: normal;
}

.v-btn {
display: inline-flex;
height: 44px;
padding: 5px 20px 5px 20px;
gap: 8px;
flex-shrink: 0;
border-radius: 8px;
background: #0397FB !important;
border-color: #0397FB;
}


</style>



<template>
  <v-app>
<v-container> 
<v-row>
  <v-col cols="auto">
          <span class="select-container"> I need a/an
          </span>  
         </v-col>
        <v-col cols="auto"        :style="{
  minWidth: '150px', 
  maxWidth: '200px' 
}">
          <v-select
            class="mySelect"
            v-model="selectedCategory"
            :items="Object.keys(categories)"
            dense
            variant="underlined"
            required
          ></v-select> 

        </v-col>
       
        <!-- :cols="getColWidth(param)" -->
 <v-col cols="auto" v-for="(param, index) in selectedParameters" :key="index">
  <v-row v-if="shouldShowParameter[index]">
    <v-col cols="auto">
      <span class="select-container">
        {{ getLabel(param.name) }}
      </span>
    </v-col>


    <v-col cols="auto">
      <v-select
        class="mySelect"
        v-model="selectedOptions[index]"
        :items="param.options"
        variant="underlined"
        required
        :multiple="isMultipleSelect(param.name)"
        :chips="isMultipleSelect(param.name)"
        :style="{ minWidth: '100px', maxWidth: '500px' }"
      />
    </v-col>
  </v-row>
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
      currentParamIndex: 0,  
      activeParam: 0 
      //selectedInternalCategory: null
    };
  },
  computed: {
  shouldShowParameter() {
    return this.selectedParameters.map((_, index) => {
      if (index === 0) {
        return true; // Always show the first parameter
      } else {
        return this.selectedOptions[index - 1].length > 0;
      }
    });
  },
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
      this.resetParams(); // Call reset here

    },
  },
  methods: {
    onSelect() {
  if (this.selectedOptions[this.currentParamIndex].length > 0) {
    this.currentParamIndex++;
  }
},

  // Reset on category change  
  resetParams() {
    this.currentParamIndex = 0;
  },


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


//     getColWidth(param) {
//   return this.isMultipleSelect(param.name) ? 8 : 3;
// },
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
  mounted() {
  this.currentParamIndex = 1;
}
};
</script>
