import React, { useState } from 'react';
import CreateEventForm from './CreateEventForm';
import UpdateEventForm from './UpdateEventForm';
import DeleteEventForm from './DeleteEventForm';

export default function AdminEvent() {
    const [currentAction, setCurrentAction] = useState(null);

    const handleButtonClick = (action) => {
        setCurrentAction(action);
    };

    return (
        <>
            <div>
                <button className="btn btn-primary" style={{marginLeft: "5px"}} onClick={() => handleButtonClick('create')}>Create</button>
                <button className="btn btn-primary" style={{marginLeft: "5px"}} onClick={() => handleButtonClick('update')}>Read & Update</button>
                <button className="btn btn-primary" style={{marginLeft: "5px"}} onClick={() => handleButtonClick('delete')}>Delete</button>
            </div>

            {currentAction === 'create' && <CreateEventForm />}
            {currentAction === 'update' && <UpdateEventForm />}
            {currentAction === 'delete' && <DeleteEventForm />}
        </>
    );
}