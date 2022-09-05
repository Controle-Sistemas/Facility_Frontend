export const cnpjMask = (value) => {
	if(value){
		return value
		.replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
		.replace(/(\d{2})(\d)/, '$1.$2') // captura 2 grupos de número o primeiro com 2 digitos e o segundo de com 3 digitos, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de número
		.replace(/(\d{3})(\d)/, '$1.$2')
		.replace(/(\d{3})(\d)/, '$1/$2') // captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
		.replace(/(\d{4})(\d)/, '$1-$2')
		.replace(/(-\d{2})\d+?$/, '$1'); // captura os dois últimos 2 números, com um - antes dos dois números
	}
	
};

export const telefoneMask = (value) => {
	if(value){
		if (value.length >= 10) {
			return value
				.replace(/\D/g, '') //Remove tudo o que não é dígito
				.replace(/^(\d{2})(\d)/g, '($1) $2') //Coloca parênteses em volta dos dois primeiros dígitos
				.replace(/(\d)(\d{4})$/, '$1-$2'); //Coloca hífen entre o quarto e o quinto dígitos
		} else {
			return value
				.replace(/\D/g, '') //Remove tudo o que não é dígito
				.replace(/(\d)(\d{4})$/, '$1-$2'); //Coloca hífen entre o quarto e o quinto dígitos
		}
	}
	
};


export const CepMask = (value) => {
	if(value){
		return value
		.replace(/\D+/g, '') // não deixa ser digitado nenhuma letra
		.replace(/(\d{2})(\d)/, '$1.$2')// captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
		.replace(/(\d{3})(\d)/, '$1-$2')// captura 2 grupos de número o primeiro e o segundo com 3 digitos, separados por /
	}
	
	}

export function formatData(data: string) {
	const dataSplit = data.split('-');
	const dataFormatada = `${dataSplit[2].length === 1 ? `0${dataSplit[2]}` : dataSplit[2]}/${dataSplit[1]}/${dataSplit[0]}`;
	return dataFormatada;
}

export function formatTime(time: string){
	const timeSplit = time.split(':')
	for (let i = 0; i < timeSplit.length; i++) {
		if(timeSplit[i].length <= 1){
			timeSplit[i] = `0${timeSplit[i]}`
		}
	}
		
	
	const horaFormatada = `${timeSplit[0]}:${timeSplit[1]}:${timeSplit[0]}`
	return horaFormatada
}