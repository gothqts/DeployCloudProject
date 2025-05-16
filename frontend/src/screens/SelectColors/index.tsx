import {useState} from "react";
import type {IColors, IInputValues} from "../../types.ts";
import styles from './selectColors.module.css';
import {urls} from "../../navigate/urls.ts";
import {useNavigate} from "react-router";

const SelectColors = () => {
    const navigate = useNavigate();
    const generateEmptyColors = (): IColors => {
        return {
            color1: '',
            color2: ''
        }
    }

    const generateInputValues = (): IInputValues => {
        return {
            red: 'red',
            blue: 'blue',
            yellow: 'yellow'
        }
    }

    const [colors, setColors] = useState(generateEmptyColors());
    const [isSubmitted, setIsSubmitted] = useState(false);
    const inputValues = generateInputValues();

    const handleColorChange = (field: keyof IColors, color: string) => {
        setColors(prev => ({...prev, [field]: color}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        navigate(urls.result);
        console.log('Submitted colors:', colors);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.container}>
            <h1 className='header'>Color Mixer</h1>
            <div className={styles.subtitle}>Select two colors to mix</div>

            <div className={styles.colorSelection}>
                <div className={styles.colorGroup}>
                    <h3 className={styles.groupTitle}>First color:</h3>
                    <div className={styles.radioGroup}>
                        {Object.entries(inputValues).map(([key, value]) => (
                            <label
                                key={`color1-${key}`}
                                className={`${styles.radioLabel} ${styles[key]}`}
                                data-selected={colors.color1 === value}
                            >
                                <input
                                    type="radio"
                                    name="color1-group"
                                    value={value}
                                    checked={colors.color1 === value}
                                    onChange={() => handleColorChange('color1', value)}
                                    className={styles.radioInput}
                                    required
                                />
                                <span className={styles.radioCustom}></span>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>

                <div className={styles.colorGroup}>
                    <h3 className={styles.groupTitle}>Second color:</h3>
                    <div className={styles.radioGroup}>
                        {Object.entries(inputValues).map(([key, value]) => (
                            <label
                                key={`color2-${key}`}
                                className={`${styles.radioLabel} ${styles[key]}`}
                                data-selected={colors.color2 === value}
                            >
                                <input
                                    type="radio"
                                    name="color2-group"
                                    value={value}
                                    checked={colors.color2 === value}
                                    onChange={() => handleColorChange('color2', value)}
                                    className={styles.radioInput}
                                    required
                                />
                                <span className={styles.radioCustom}></span>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            {colors.color1 && colors.color2 && (
                <div className={styles.result}>
                    <p className={styles.resultText}>Selected colors:</p>
                    <div className={styles.colorDisplay}>
                        <span
                            className={styles.colorSwatch}
                            style={{backgroundColor: colors.color1}}
                        ></span>
                        <span
                            className={styles.colorSwatch}
                            style={{backgroundColor: colors.color2}}
                        ></span>
                    </div>
                </div>
            )}

            <button
                type="submit"
                className={styles.submitButton}
                disabled={!colors.color1 || !colors.color2}
            >
                Mix Colors
                <span className={styles.buttonEffect}></span>
            </button>

            {isSubmitted && (
                <div className={styles.successMessage}>
                    Colors submitted successfully!
                </div>
            )}
        </form>
    );
};

export default SelectColors;