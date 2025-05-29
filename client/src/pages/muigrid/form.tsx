import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

interface obj {
  name: string;
  type: string;
}

interface formInitialStateProps {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  address: string;
  city: string;
}

const MultiStepForm = () => {
  const [formIndex, setFormIndex] = useState<number>(0);
  const [formInitialState, setFormInitialState] = useState<formInitialStateProps>({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    address: "",
    city: "",
  });

  const componentMap = [Component1, Component2, Component3];
  const CurrentComponent = componentMap[formIndex];

  const handleFormIndex = (value: number) => {
    setFormIndex(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormInitialState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="flex w-48 h-64 flex-col">
      <form>
        <CurrentComponent
          formIndex={formIndex}
          handleFormIndex={handleFormIndex}
          formInitialState={formInitialState}
          handleInputChange={handleInputChange}
        />
      </form>
    </div>
  );
};

export default MultiStepForm;

const Component1 = ({
  formIndex,
  handleFormIndex,
  formInitialState,
  handleInputChange,
}: {
  formIndex: number;
  handleFormIndex: (value: number) => void;
  formInitialState: formInitialStateProps;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const component1: obj[] = [
    { name: "email", type: "email" },
    { name: "password", type: "password" },
  ];

  return (
    <div>
      {component1.map((item, i) => (
        <div key={i}>
          <label>{item.name}</label>
          <TextField
            type={item.type}
            name={item.name}
            value={formInitialState[item.name as keyof formInitialStateProps]}
            onChange={handleInputChange}
            autoFocus
          />
        </div>
      ))}
      <Box>
        <Button disabled={formIndex === 0} onClick={() => handleFormIndex(formIndex - 1)}>
          back
        </Button>
        <Button onClick={() => handleFormIndex(formIndex + 1)}>next</Button>
      </Box>
    </div>
  );
};

const Component2 = ({
  formIndex,
  handleFormIndex,
  formInitialState,
  handleInputChange,
}: {
  formIndex: number;
  handleFormIndex: (value: number) => void;
  formInitialState: formInitialStateProps;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const component2: obj[] = [
    { name: "firstname", type: "text" },
    { name: "lastname", type: "text" },
  ];

  return (
    <div>
      {component2.map((item, i) => (
        <div key={i}>
          <label>{item.name}</label>
          <TextField
            type={item.type}
            name={item.name}
            value={formInitialState[item.name as keyof formInitialStateProps]}
            onChange={handleInputChange}
            autoFocus
          />
        </div>
      ))}
      <Box>
        <Button onClick={() => handleFormIndex(formIndex - 1)}>back</Button>
        <Button onClick={() => handleFormIndex(formIndex + 1)}>next</Button>
      </Box>
    </div>
  );
};

const Component3 = ({
  formIndex,
  handleFormIndex,
  formInitialState,
  handleInputChange,
}: {
  formIndex: number;
  handleFormIndex: (value: number) => void;
  formInitialState: formInitialStateProps;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const component3: obj[] = [
    { name: "address", type: "text" },
    { name: "city", type: "text" },
  ];

  return (
    <div>
      {component3.map((item, i) => (
        <div key={i}>
          <label>{item.name}</label>
          <TextField
            type={item.type}
            name={item.name}
            value={formInitialState[item.name as keyof formInitialStateProps]}
            onChange={handleInputChange}
            autoFocus
          />
        </div>
      ))}
      <Box>
        <Button onClick={() => handleFormIndex(formIndex - 1)}>back</Button>
        <Button
          onClick={() => {
            if (formIndex === 2) {
              // Handle form submission or final step
              console.log("Form submitted", formInitialState);
            } else {
              handleFormIndex(formIndex + 1);
            }
          }}
        >
          {formIndex === 2 ? "Submit" : "next"}
        </Button>
      </Box>
    </div>
  );
};
