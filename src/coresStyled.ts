export const colorPallete = {
    light:{
        bgColor:"#fefefe",
        bgHoverColor:"#fff3f3",
        primaryColor:"#003775",
        secondaryColor:"#939393",
        buttonPrimaryBgColor:"#003775",
        buttonTextColor:"#fff",
        buttonTextHoverColorPrimary:"#003775",
        dangerColor:"#c82333",
        buttonTextHoverColorDanger:"#c82333"


    },
    dark:{
        bgColor:"#363738",
        bgHoverColor:"#363f4f",
        primaryColor:"#A7D0F9",
        secondaryColor:"#F0F4F8",
        buttonPrimaryBgColor:"#6F6BF2",
        buttonTextPrimaryColor:"#2A2859",
        buttonTextHoverColorPrimary:"#6F6BF2",
        dangerColor:"#F23D7F",
        buttonTextDangerColor:"#2A2859",
        buttonTextHoverColorDanger:"#F23D7F",
        inputBgColor:"#404547"
    },
    all:{
        borderLight:"#eee",
        borderDark:"#474D4F"
    }
}

export let tema = localStorage.getItem('Tema') 

export function setTema(isDarkMode){
    if(isDarkMode){
        tema = 'dark'
    } else {
        tema = 'light'
    }
    localStorage.setItem('Tema',tema)

}