import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css'
import NewCard from './newCard';
import CloseBTN from './closeButton';
import { Container } from './style';

import { useState } from 'react';
import Task from '../card/index.js';


function Group() {
    const [list, setList] = useState([]);

    const addList = task => {
        if (!task.name || /^\s*$/.test(task.name)) {
            return;
        }

        setList(list => [...list, task]);

    };

    const onEdit = item => {
        setList(list => list.map(i => {
            if (item.id === i.id) {
               return item;
            }
            return i;
        }))

    }

    const onDelete = item => {
        setList(list => list.filter(i => i.id !== item.id))
    }

    return (
        <Container>
            <Card border="dark" style={{ width: '18rem', marginTop: 20, marginLeft: 30, }}>

                <Card.Header style={{ background: '#1976d2', color: '#FFFFFF', fontSize: '26px', border: '2px solid black', display: 'flex', position: 'relative', height: 55 }}>
                    Header
                    <CloseBTN></CloseBTN>
                </Card.Header>

                <Card.Body id='card-body' style={{ background: '#e7e7e7', fontSize: '20px', display: 'flex', flexDirection: 'column' }}>

                    {
                        list.map(item => (<Task key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />))

                    }

                    <NewCard onSubmit={addList} ></NewCard>

                </Card.Body>
            </Card>
        </Container>
    );
}

export default Group;