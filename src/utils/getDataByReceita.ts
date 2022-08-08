import axios from 'axios'
import { ajax } from 'jquery';


export function getDataByReceita(cnpj){
    return ajax({
        url: `https://www.receitaws.com.br/v1/cnpj/${cnpj}`,
        method: 'GET',
        dataType:'jsonp',
        crossDomain: true,
        
      }).done((data) => {
        return data;
    }).fail((err) => {
        return err;
    })
    
}