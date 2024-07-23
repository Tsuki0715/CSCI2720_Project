import React, { useEffect, useRef, useState } from 'react';
import CreateForm from './CreateForm';
import DeleteForm from './DeleteForm';
import UpdateForm from './UpdateForm';

export default function AdminUser() {
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

            {currentAction === 'create' && <CreateForm />}
            {currentAction === 'update' && <UpdateForm />}
            {currentAction === 'delete' && <DeleteForm />}
        </>
    );
}