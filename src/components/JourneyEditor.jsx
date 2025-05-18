import { useState } from "react";
import { Plus, Save, Trash2, Milestone} from "lucide-react";
import { useNavigate } from "react-router-dom";

import ActionButton from "../components/ActionButton";
import Input from "./Input";
import EntityItem from "./EntityItem";
import Modal from "../components/Modal";

import { saveJourney, saveStep } from "../utils/TemplateStore";

export default function JourneyEditor() {
  // handling entity data
  const [journeyData, setJourneyData] = useState({ name: "", description: ""});
  const [stepData, setStepData] = useState({ name: "", description: ""});
  const [steps, setSteps] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // handling required fields error messages
  const [journeyNameError, setJourneyNameError] = useState("");
  const [stepNameError, setStepNameError] = useState("");

  const navigate = useNavigate();

  function handleStepAdditionRequest(){
    setShowModal(true);
  }

  function handleAddStep() {
    // handles required fields
    if (!stepData.name.trim()) {
      setStepNameError("Step name is required.");
      return;
    }
    setStepNameError(""); 

    // saves step data in local storage
    const newStep = {
      id: Date.now(), //TO BE MODIFIED when moving to proper database
      name: stepData.name.trim(),
      description: stepData.description.trim(),
      actions: [],
    };
    saveStep(newStep);
    console.log("Saving Step:", newStep);

    // updates state
    setSteps((prev) => [...prev, newStep]);
    setStepData({ name: "", description: "" });
    setShowModal(false);
  }

  function handleJourneySave() {
    // handles required fields
    if (!journeyData.name.trim()) {
      setJourneyNameError("Journey name is required.");
      return;
    }
    setJourneyNameError(""); 

    // saves step data in local storage
    const journeySteps = steps.map((step) => step.id);
    const journey = {
      id: Date.now(), //TO BE MODIFIED when moving to proper database
      name: journeyData.name,
      description: journeyData.description,
      steps: journeySteps,
    };
    saveJourney(journey);
    console.log("Saving Journey:", journey);

    // Redirect to the journey editing page
    navigate("journeys");
  }

  function handleDeleteStep(id) {
    setSteps((prev) => prev.filter((step) => step.id !== id));
  }

  return (
    <div className="space-y-6">
      <Input 
        label="Journey Name"
        placeholder="e.g. Online product purchase"
        type="text"
        value={journeyData.name}
        onChange={(e) => setJourneyData((prev) => {
          return { ...prev, name: e.target.value};
        })}
        required={true}
        error={journeyNameError}
        ariaLabel="Name given to the journey"
      />
      <Input 
        label="Journey Description"
        placeholder="e.g. User steps taken to complete a product purchase on the e-commerce shop."
        type="text"
        value={journeyData.description}
        onChange={(e) => setJourneyData((prev) => {
          return { ...prev, description: e.target.value};
        })}
        ariaLabel="Description of the journey, in a business friendly manner."
      />

      <div className="space-y-4">
        {steps.length > 0 && steps.map((step, index) => (
          <div
            key={step.id}
            className="border border-gray-200 rounded p-4 bg-white"
          >
            <EntityItem
              key={step.id}
              item={step}
              buttons={[{type:"action", onClick: () => handleDeleteStep(step.id), icon: Trash2, label:"Delete", variant:"danger"}]}
              icon={Milestone}
            />
          </div>
        ))}
      </div>

      <div className="flex space-x-3">
        <ActionButton onClick={handleStepAdditionRequest} variant="ghost" label="Add Step" icon={Plus} />
        <ActionButton onClick={handleJourneySave} variant="primary" label="Save Journey" icon={Save} />
      </div>

      <Modal
        isOpen={showModal}
        title="Add a step to the journey"
        actions={[
          { 
            Component: ActionButton, 
            props: { 
              onClick: () => {
              setShowModal(false);
              setJourneyNameError(""); 
            }, 
            label: "Cancel", variant: "secondary"}
          },
          { 
            Component: ActionButton, 
            props: { onClick: () => handleAddStep(), label: "Confirm", variant: "primary"}
          }
        ]}
      >
        <Input 
          label="Step Name"
          placeholder="e.g. Product Viewed"
          type="text"
          value={stepData.name}
          onChange={(e) => setStepData((prev) => {
            return { ...prev, name: e.target.value};
          })}
          required={true}
          ariaLabel="Name given to the journey step"
          error={stepNameError}
        /> 
        <Input 
          label="Step Description"
          placeholder="e.g. User is visiting a product page"
          type="text"
          value={stepData.description}
          onChange={(e) => setStepData((prev) => {
            return { ...prev, description: e.target.value};
          })}
          ariaLabel="Description of what the journey step entails"
        /> 
      </Modal>
    </div>
  );
}


