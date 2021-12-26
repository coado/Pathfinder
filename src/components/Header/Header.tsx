import React from 'react'; 
import {ReactComponent as Weight} from '../../svg/weight.svg';
import './Header.styles.scss';

interface IHeader {
        startAlgorithm: () => void;
        setAlgorithm: (algorithm: string) => void;
        currentAlgorithm: string;
        weight: {
            active: boolean;
            value: number;
        };
        setWeight: (value: {
            active: boolean;
            value: number;
        }) => void;
        setDimensions: (value: {
            rows: number;
            columns: number;
        }) => void;
        clearBoard: () => void 
    }

export const Header: React.FC<IHeader> = ({ clearBoard, setWeight, weight, setDimensions, startAlgorithm, setAlgorithm, currentAlgorithm }) => {
    
    const handleSettingAlgorithm = (algorithm: string) => {
        setAlgorithm(algorithm)
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value)
        setDimensions({
            rows: value,
            columns: value*2
        });
    }

    const onChangeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = 10;
        if (e.target.value) value = Number(e.target.value)
        
        setWeight({
            ...weight,
            value
        })
    }

    const handleWeightClick = () => {
       setWeight({
           ...weight,
           active: !weight.active,
       })
    }
    
    const filterInputText = (e: React.KeyboardEvent<HTMLInputElement>) => (!/^[0-9]*$/.test(e.key)) ? e.preventDefault() : null;

    return (
        <div className='Header'>
            <div className='Header__options'>
                <div className='Header__dropdown'>
                        <h1>{ currentAlgorithm }</h1>
                        <p> &#8227; </p>
                    <div className='Header__dropdown--container'>
                        <div onClick={() => handleSettingAlgorithm('Dijsktra')} className='Header__dropdown--element'>Dijsktra</div>
                        <div onClick={() => handleSettingAlgorithm('A*')} className='Header__dropdown--element'>A*</div>
                        <div onClick={() => handleSettingAlgorithm('Greedy BFS')} className='Header__dropdown--element'>Greedy BFS</div>
                        <div onClick={() => handleSettingAlgorithm('DFS')} className='Header__dropdown--element'>DFS</div>
                    </div>
                </div>

                <div className='Header__weight'>
                    <Weight onClick={handleWeightClick} className={`Header__weight--icon ${weight.active ? 'Header__weight--icon--active' : null}`} />
                    <input className='Header__weight--input' onKeyPress={e => filterInputText(e)} onChange={e => onChangeHandle(e)} maxLength={2} placeholder='10' autoComplete='off' autoCorrect='off' />
                </div>
            </div>
            <button className='Header__startButton' onClick={startAlgorithm}> START </button>
            <div className='Header__options'>
                        <input onChange={e => handleChange(e)} defaultValue='25'  type='range'  min='25' max='35' className='Header__slider' />
                        <h1 onClick={clearBoard} className='Header__clearBoard'> CLEAR </h1>
            </div>
        </div>
)}