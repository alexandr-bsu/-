import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  name: "",
  city: "",
  about: "",
  age: "",
  sexClient: "",
  minClientAge: "",
  maxClientAge: "",
  psychologistPersonalTherapyType: "",
  psychologistPersonalTherapyDuration: "",
  mainModal: '',
  customMainModal:'',
  additionalModals: [],
  customAdditionalModals:'',
  skills: [],
  queries: [],
  telegram_link: '',
  site_link: '',
  vk_link: '',
  minPrice: '',
  maxPrice: '',
  isMarried:false,
  hasChildren: false,
  allWithPriceMode: false,
  firstFreeMode: false, 
  helpHandMode: false,
  education: [{
    'educationItemProgramTitle': '',
    'educationItemTitle': '',
    'educationItemType': '',
    'educationItemYear': '',
  }]
};

export const psySlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setPsychologistPersonalTherapyType: (state, type) => {
      state.psychologistPersonalTherapyType = type.payload
    },

    setCity: (state, city) => {
      state.city = city.payload
    },

    setAllWithPriceMode: (state, mode) => {
      state.allWithPriceMode = mode.payload
    },
    setFirstFreeMode: (state, mode) => {
      state.firstFreeMode = mode.payload
    },
    setHelpHandMode: (state, mode) => {
      state.helpHandMode = mode.payload
    },
    
    setMinPrice: (state, price) => {
      state.minPrice = price.payload
    },

    setMaxPrice: (state, price) => {
      state.maxPrice = price.payload
    },

    setIsMarried: (state, isMarried) => {
      state.isMarried = isMarried.payload
    },
    setHasChildren: (state, hasChildren) => {
      state.hasChildren = hasChildren.payload
    },

    setAbout: (state, about) => {
      state.about = about.payload
    },

    setAnketaData: (state, data) => {
      let d = data.payload
      state.name = d.name
      state.city = d?.city
      state.age = d.age
      state.sexClient = d.sexClient
      state.minClientAge = d.minClientAge
      state.maxClientAge = d.maxClientAge
      state.psychologistPersonalTherapyType = d.psychologistPersonalTherapyType
      state.psychologistPersonalTherapyDuration = d.psychologistPersonalTherapyDuration
      state.mainModal = d.mainModal
      state.additionalModals = d.additionalModals

      let modal_list = [
        'Аналитическая психология',
        'Психоанализ',
        'КПТ',
        'Гештальт',
        'Нет дополнительной модальности'
      ]

      if (!modal_list.includes(state.mainModal)){
        state.customMainModal = d.mainModal
      }

      if (!modal_list.includes(state.additionalModals[0])){
        state.customAdditionalModals = d.additionalModals
      }

      state.skills = d.skills
      state.queries = d.queries
      state.telegram_link = d.telegram_link
      state.site_link = d.site_link
      state.vk_link = d.vk_link
      state.minPrice= d.minPrice,
      state.maxPrice= d.maxPrice,
      state.isMarried=d.isMarried,
      state.hasChildren= d.hasChildren,
      state.allWithPriceMode= d.allWithPriceMode,
      state.firstFreeMode= d.firstFreeMode, 
      state.helpHandMode= d.helpHandMode,
      state.about = d.about
    },

    setCustomMainModal: (state, modal) => {
      state.customMainModal = modal.payload
    },

    setCustomAdditionalModals: (state, modal) => {
      state.customAdditionalModals = modal.payload
    },

    setEducationList: (state, list) => {
      state.education = list.payload
      console.log(state.education)
    },

    addEducationItem: (state) => {
      state.education.push({
        'educationItemProgramTitle': '',
        'educationItemTitle': '',
        'educationItemType': '',
        'educationItemYear': '',
      })
    },

    removeEducationItemByIndex: (state, index) => {
      state.education.splice(index.payload, 1)
    },

    setDataEduList: (state, data) => {
      state.education[data.payload.index][data.payload.key] = data.payload.data
    },

    setVk: (state, vk_page) => {
      state.vk_link = vk_page.payload
    },
    setTelegram: (state, telegram_page) => {
      state.telegram_link = telegram_page.payload
    },
    setSite: (state, site_page) => {
      state.site_link = site_page.payload
    },
    setName: (state, name) => {
      state.name = name.payload;
    },
    setAge: (state, age) => {
      state.age = age.payload;
    },
    setSexClient: (state, sexClient) => {
      state.sexClient = sexClient.payload;
    },
    setMinClientAge: (state, minClientAge) => {
      state.minClientAge = minClientAge.payload;
    },
    setMaxClientAge: (state, maxClientAge) => {
      state.maxClientAge = maxClientAge.payload;
    },
    setPsychologistPersonalTherapyDuration: (state, psychologistPersonalTherapyDuration) => {
      state.psychologistPersonalTherapyDuration = psychologistPersonalTherapyDuration.payload;
    },
    setMainModal: (state, modal) => {
      state.mainModal = modal.payload
    },

    setAdditionalModals: (state, modal) => {
      state.additionalModals = [modal.payload]
    },

    toogleAdditionalModals: (state, modal) => {
      if (state.additionalModals.includes(modal.payload)) {
        state.additionalModals.splice(state.additionalModals.indexOf(modal.payload), 1);
      } else {
        state.additionalModals.push(modal.payload);
      }
    },

    toogleSkills: (state, skill) => {
      if (state.skills.includes(skill.payload)) {
        state.skills.splice(state.skills.indexOf(skill.payload), 1);
      } else {
        state.skills.push(skill.payload);
      }
    },
    toogleQueries: (state, query) => {
      if (state.queries.includes(query.payload)) {
        state.queries.splice(state.queries.indexOf(query.payload), 1);
      } else {
        state.queries.push(query.payload);
      }
    },
  },
});

export const {
  setName,
  setAge,
  setSexClient,
  setMaxClientAge,
  setMinClientAge,
  setPsychologistPersonalTherapyDuration,
  toogleSkills,
  toogleQueries,
  setMainModal,
  toogleAdditionalModals,
  setSite,
  setVk,
  setTelegram,
  addEducationItem,
  removeEducationItemByIndex,
  setDataEduList,
  setEducationList,
  setAnketaData,
  setAbout,
  setIsMarried,
  setHasChildren,
  setMinPrice,
  setCustomMainModal,
  setCustomAdditionalModals,
  setMaxPrice,
  setHelpHandMode,
  setAdditionalModals,
  setAllWithPriceMode,
  setFirstFreeMode,
  setCity,
  setPsychologistPersonalTherapyType
} = psySlice.actions;
export default psySlice.reducer;
