import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

import EventEditor from "../features/events/EventEditor";
import FadingAlert from "../components/FadingAlert";
import EntityPageHeader from "../components/PageHeader";
import ActionButton from "../components/ActionButton";
import Modal from "../components/Modal";

import { getEvent } from "../utils/EntityStore";

export default function EventEditPage() {
    const [event, setEvent] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    let navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchedEvent = getEvent(id);           
        if (!fetchedEvent) {
            setError("Event not found.");
        } else {
            setEvent(fetchedEvent);
        }
    }, [id]);

    function handleDeleteRequest() {
        setShowConfirmationModal(true);
    };

    function handleCancelRequest() {
        navigate(eventItemPath);
    };
    
    function handleDelete() {
        deleteEntityById(id);
        navigate(eventsLibraryPath, { replace: true });
    };

    const eventsLibraryPath = "/events";
    const eventItemPath = `/events/${id}`;

    const renderLoadingContent = (
        <>
            <EntityPageHeader 
                title="Edit your event"
                breadcrumbs={[{ label: "Events", to: eventsLibraryPath }, { label: "Event", to: eventItemPath }, { label: "Edit", to: "" }]}
            />
            <div className="bg-white rounded p-8 flex justify-center items-center h-40 mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-sm text-gray-600 ml-2">Event is loading...</p>
            </div> 
        </>
    );

    const renderEditingContent = (
        <>
            <EntityPageHeader 
                title="Edit your event"
                breadcrumbs={[{ label: "Events", to: eventsLibraryPath }, { label: "Event", to: eventItemPath }, { label: "Edit", to: "" }]}
                actions={[
                    {Component: ActionButton, props: {onClick: handleCancelRequest, label: "Cancel", variant: "ghost"}},
                    {Component: ActionButton, props: {onClick: handleDeleteRequest, label: "Delete", Icon: Trash2, variant: "danger"}}
                ]}
            />
            <h1>Content in creation...</h1>
            {showAlert ? (
                <FadingAlert 
                    message={`Your event was successfully saved!`}
                    type="success"
                    onUnmount={() => setShowAlert(false)}
                />) : null}
            <EventEditor 
                mode="edit" 
                initialTemplate={event} 
                onSubmit={() => setShowAlert(true)}
            />
        </>
    );
  
    return (
        <div className="bg-white p-8 w-full h-full rounded-lg">
            {
                event === null ? 
                (
                    <div className="bg-white p-8 max-w-6xl mx-auto rounded-lg">
                        {renderLoadingContent}
                    </div>
                )
                : (
                <>
                    <div className="bg-white p-8 max-w-6xl mx-auto rounded-lg">
                        {renderEditingContent}
                    </div>
                    <Modal 
                        isOpen={showConfirmationModal}
                        title="Confirm deletion"
                        confirmBtn={{ variant:"danger", onClick: () => handleDelete(), label:"Confirm"}}
                        cancelBtn={{ variant:"ghost", onClick: () => setShowConfirmationModal(false), label:"Cancel"}}
                        >
                        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this event?</p>
                    </Modal>
                </>
                )
            }
        </div>
        );
}

