import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { getJourney } from "../../utils/TemplateStore";
import EntityPageHeader from "../../components/EntityPageHeader";
import NavigationButton from "../../components/NavigationButton";
import ActionButton from "../../components/ActionButton";
import EntityNotFound from "../../layout/EntityNotFound";


/**
 * Provides a user friendly view of the JSON template information.
 *
 * @typedef {object} JourneyViewProps
 * @property {string} id Identifier of the template to represent
 *
 * @param {JourneyViewProps} props
 * @returns {JSX.Element}
 */
export default function JourneyView({ id, onDelete }) {

    const [journey, setJourney] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const journey = getJourney(id);

        // 404 errors handling, to refactor when leaving local storage
        if (Object.keys(journey).length === 0 && journey.constructor === Object) {
            setError("404");
        } else {
            setJourney(journey);
        }
    }, [id]);

    // Journey was not found
    if (error) {
        return (
        <EntityNotFound
            entity="Journey"
            redirectPath="/journeys"
            redirectLabel="Go back to Journeys"
        />);
    }

    if (!journey) {
        return <p className="p-4">Loading...</p>;
    }

    return (
        <>
            <EntityPageHeader 
                title={journey.name}
                description={journey.description ? journey.description : null }
                breadcrumbs={[{label:"Journeys", to:"/journeys"}, {label:"Journey Details", to:`/journeys/${id}`}]}
                badges={journey.category ? [{label: journey.category, variant: "info"}] : null}
                actions={[
                    {Component: NavigationButton, props: {navigateTo: `/journeys/${id}/edit`, label:"Edit", icon: Pencil, variant: "primary"}},
                    {Component: ActionButton, props: {onClick: onDelete, label:"Delete", icon: Trash2, variant: "danger"}}
                ]}
            />
        </>
    );
}

// EntityPageHeader badges will need to be refactored, to account for the data model and use cases of badges per Entity
