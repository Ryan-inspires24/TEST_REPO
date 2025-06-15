import { useEffect, useState } from 'react';
import { SimpleTextInput, FreeTextInput, DateTimeInput, DefaultInput } from './InputsRendering';
import db from '../firebase';
import { collection, addDoc } from 'firebase/firestore';


export default function QuestionnaireForm({ id }) {
    const [questionnaire, setQuestionnaire] = useState(null);
    const [formData, setFormData] = useState({});
    const [submittedData, setSubmittedData] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`https://test.almamaters.club:9090/questionnaire/${id}`);
                const json = await res.json();
                setQuestionnaire(json.data);
            } catch (err) {
                console.error("Error fetching questionnaire:", err);
            }
        }

        fetchData();
    }, [id]);



    const handleChange = (key, value) => {
        const updatedFormData = {
            ...formData,
            [key]: value
        };
        setFormData(updatedFormData);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmittedData(formData);

        try {
            const docRef = await addDoc(collection(db, "questionnaire_responses"), {
                questionnaire_id: id,
                answers: formData,
                submitted_at: new Date()
            });

            console.log("Document written with ID: ", docRef.id);
        } catch (err) {
            console.error("Error adding document: ", err);
        }
    };



    const renderInput = (response) => {
        const { type, label, input_key } = response;
        const value = formData[input_key] || '';

        const inputProps = {
            label,
            value,
            onChange: val => handleChange(input_key, val)
        };


        switch (type) {
            case 'SIMPLE_TEXT':
                return <SimpleTextInput {...inputProps} />;
            case 'FREE_TEXT':
                return <FreeTextInput {...inputProps} />;
            case 'DATE_TIME':
                return <DateTimeInput {...inputProps} />;
            default:
                return <DefaultInput {...inputProps} />;
        }
    };

    if (!questionnaire) return <p>Loading...</p>;

    return (
        <div>
            <h2>{questionnaire.name}</h2>
            <p>{questionnaire.description}</p>

            <form onSubmit={handleSubmit}>
                {questionnaire.questions.map((question) => (
                    <div key={question.id}>
                        <p><strong>{question.content.replace(/<\/?[^>]+(>|$)/g, '')}</strong></p>

                        {question.settings?.responses?.map((response, idx) => (
                            <div key={idx}>
                                <label>{response.label}</label><br />
                                {renderInput(response)}
                            </div>
                        ))}
                    </div>
                ))}

                <button type="submit">Submit</button>
            </form>

            {submittedData && (
                <div>
                    <h3>Submitted Information</h3>
                    <ul>
                        {Object.entries(submittedData).map(([key, value]) => (
                            <li key={key}><strong>{key}</strong>: {value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
