import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { deleteCard, updateCard, getUserCards } from '../../../service/requests.js';
import Historic from '../../../elements/historic/index.js';
import { Spinner } from 'react-bootstrap';

const EditGroupCard = (props) => {
    const { dispatch, visible } = props;
    

    const onClose = () => {
        dispatch({ type: 'HIDE_MODAL' });
    }

    return <Modal show={visible} onHide={onClose}>
        <ModalContent {...props} />
    </Modal>;
}


const ModalContent = React.memo((props) => {
    const { dispatch, state } = props;
    const [header, setTitle] = useState(state.current !== undefined ? state.current.header : '');
    const [description, setDescription] = useState(state.current !== undefined ? state.current.description : '');
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(true)
    const cardID = state.current !== undefined ? state.current.id : null;

    useEffect(() => {

        getUserCards().then(response => {
            setHistoryList(response.data);
            setLoading(false);
        })
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        const card = {
            id: state.current.id,
            position: state.current.position,
            header: header,
            description: description,
            user: JSON.parse(localStorage.getItem('user')).id
        };

        updateCard(card).then( dispatch({ type: 'UPDATE_GROUP_CARD', payload: { header, description } }) );
    }

    const handleDelete = () => {
        deleteCard(state.current.id).then(dispatch({type: 'DELETE_GROUP_CARD'}));
    }


    return <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
            <Modal.Title>Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Nome</Form.Label>
                <Form.Control onChange={event => setTitle(event.target.value)}
                    type="text"
                    name='title'
                    value={header}
                    required
                    placeholder="exemplo: Task 1"
                />
            </Form.Group>
            <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
            >
                <Form.Label>Descrição</Form.Label>
                <Form.Control as="textarea" rows={3} onChange={event => setDescription(event.target.value)}
                    type='text'
                    name='description'
                    value={description}
                    placeholder='exemplo: Reunião com o DR. Paulo no dia 10/08'
                />
            </Form.Group>
            {loading ? (<Spinner animation="border"/>) : null}
            {!loading ? (<Historic historyList={historyList.filter(Element => Element.card.id === cardID)}/>) : null}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" style={{ background: '#FF0000' }} onClick={handleDelete}>
                Deletar 
            </Button>
            <Button id='buttonNewCard' variant="primary" type='submit'>
                Salvar
            </Button>
        </Modal.Footer>
    </Form>
})

export default EditGroupCard;