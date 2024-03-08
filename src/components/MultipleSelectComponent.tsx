//Importações
import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';

function getStyles(name: string, ramo: readonly string[], theme: Theme) { 
  return {
    fontWeight:
      ramo.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    
  };
}

export function MultipleSelect(props) { 
  const data = props.data;
  if(!data.find(x => x.descricao === 'Todos')) { //Se não existir o item 'Todos' no array, adiciona
    data.push({
      descricao: 'Todos',
      ativo:1
    })
  }
  

  const theme = useTheme();
  const [ramo, setRamo] = React.useState<string[]>([]); //Array de ramos selecionados


  const handleChange = (event: SelectChangeEvent<typeof ramo>) => { 

    const {
      target: { value }, 
    } = event; //Pega o valor do evento
    
    if (value === 'Todos') { //Se o valor for 'Todos', seleciona todos os ramos
      setRamo(data.filter(item => item !== 'Todos').toString());
    }

    setRamo(
      typeof value === 'string' ? value.split(',') : value,

    ); //Se o valor for uma string, separa os ramos por vírgula, se não, mantém o valor
    props.setValues({ //Envia os ramos selecionados para o componente pai
      ...props.values,
      RAMODEATIVIDADE:  ramo,
    });
   

  };

  const handleChangeMultiple = (event) => { 
    props.setValues({
      ...props.values,
      RAMODEATIVIDADE: ramo,
    });
    console.log('RAMO', props.values)
  };

  
  return (
    <div className="select-input-form">
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id="demo-multiple-chip-label">{props.nameSelect}</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={ramo}
        onChange={handleChange}
        onBlur={handleChangeMultiple}
        input={<OutlinedInput id="select-multiple-chip" label={props.nameSelect} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
              width: 250,
            },
          },
        }}
      >
        {data.map((item) => (
          <MenuItem
            key={item.descricao}
            value={item.descricao}
            style={getStyles(item.descricao, ramo, theme)}
          >
            {item.descricao}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </div>
  );
}