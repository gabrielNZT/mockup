import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const CreateGroupCard = (props) => {
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

    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        const order = state.groups.length;
        e.preventDefault();
        dispatch({ type: 'ADD_GROUP', payload: { id: Math.floor(Math.random() * 10000), title, order, cards: [] } });
    }

    const handleOnChange = e => {
        setTitle(e.target.value);
    }



    return <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
            <Modal.Title>Nome</Modal.Title>
        </Modal.Header>
        <Modal.Body>

            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Nome</Form.Label>
                <Form.Control
                    onChange={handleOnChange}
                    type="text"
                    name='header'
                    placeholder="exemplo: grupo de tarefas"
                    value={title}
                    autoFocus
                    required
                />
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" type="submit">
                Save Changes
            </Button>
        </Modal.Footer>
    </Form>
})

export default CreateGroupCard;