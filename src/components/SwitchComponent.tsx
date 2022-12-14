import * as React from 'react';
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';

//Componente de estilização do input para um switch
function SwitchIos(props) {


  const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#5c83b4' : '    #90ee90',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#003775',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[900]
            : theme.palette.grey[900],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#7897A0' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
  }));

  function handleChangeStatus(event) {
    if(props.activation){
      props.activation(props.id, event.target.checked); //Atualiza o estado do switch 

    } else {
      let theme = localStorage.getItem('Tema')
      theme = theme === `light` ? `dark` : `light`
      console.log(theme)
      localStorage.setItem(`Tema`,theme)
    }
  }

  return (
    <IOSSwitch sx={{ m: 1 }} defaultChecked={props.isActive} onClick={handleChangeStatus} />
  )
}

export default SwitchIos