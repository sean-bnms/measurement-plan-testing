import Modal from "./Modal";
import ActionButton from "../components/ActionButton";
import { X } from "lucide-react";

/**
 * A flexible and reusable modal to show when handling entity deletion. Contains a warning message and buttons to confirm or cancel deletion.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.showModal - Whether the modal should be showing.
 * @param {string} props.entityLabel - The type of entity to be displayed in the warning message.
 * @param {Function} props.onCancel - The expected behavior when cancel deletion button is clicked.
 * @param {Function} props.onDelete - The expected behavior when confirm deletion button is clicked.
 *
 * @returns {JSX.Element}
 */
export default function EntityDeletionModal({
    showModal,
    entityLabel,
    onCancel,
    onDelete
}) {
    return (
        <Modal
            isOpen={showModal}
            title="Confirm deletion"
            description= {`Are you sure you want to delete this ${entityLabel}?`}
            maxWidthClass="max-w-md"
            closeButton={
                {
                  Component: ActionButton, 
                  props: { onClick: onCancel, iconOnly: true, Icon: X, variant: "close", size:"xl"}
                }
              }
            actions={[
                { 
                Component: ActionButton, 
                props: { onClick: onCancel, label: "Cancel", variant: "secondary", roundedCornerClass: "rounded-sm"}
                },
                { 
                Component: ActionButton, 
                props: { onClick: onDelete, label: "Confirm", variant: "danger", roundedCornerClass: "rounded-sm"}
                }
            ]}
        />
    );
}