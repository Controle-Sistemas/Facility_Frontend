//importações
import React, { useState } from 'react';
import { CardContainer, CardBody, CardHeader } from '../styledComponents/containers';
import { CardDescription, CardValue } from '../styledComponents/Texts';
import { ButtonCloseDiv } from '../styledComponents/buttons';
import Swal from 'sweetalert2';

interface Props { //interface para receber os dados do componente pai
	id: number;
	title: string;
	typeCard?: number;
	value?: number;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	typeValue?: number;
	isChecked?: boolean;
	removeCard?: (id: number) => void;
}

export function CardPortal({ id, title, children, icon, typeCard, typeValue, value, isChecked, removeCard }: Props) {

	function handleDeleteCard(event) { //função para deletar o card
		Swal.fire({
			title: 'Deseja excluir este cartão?',
			text: 'Você não poderá reverter isso!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#003775',
			cancelButtonColor: '#c82333',
			confirmButtonText: 'Sim, excluir!',
			cancelButtonText: 'Cancelar',
			
		}).then((result) => {
			if (result.value) { //se o usuário confirmar a exclusão
				removeCard(id); //chama a função passada pelo componente pai de remover o card 
			}
		});
	}

	return (
		<CardContainer id={id.toString()} typeCard={typeCard} isChecked={isChecked}>
			<CardBody>
				{isChecked ? (
					<ButtonCloseDiv>
						<button className="btn-close" onClick={handleDeleteCard} />
					</ButtonCloseDiv>
				) : null}

				<CardHeader className="d-flex justify-content-between" style={{ width: '100%' }}>
					<h6 className="card-text text-sm-start space-right2" style={{ margin: 0 }}>
						{title}
					</h6>
					{icon}
				</CardHeader>
				<CardValue>
					{typeValue === 2 ? (
						Number(value).toFixed(2) + '%'
					) : typeValue === 1 ? (
						'R$' + Number(value).toFixed(2)
					) : (
						value
					)}
				</CardValue>
				<CardDescription>{children}</CardDescription>
			</CardBody>
		</CardContainer>
	);
}
