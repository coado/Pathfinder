import React from 'react'; 
import {ReactComponent as Weight} from '../../svg/weight.svg';
import { algorithmTypes } from '../../PathfindingVisualizer/PathfindingVisualizer'; 
import './Header.styles.scss';

interface IHeader {
        startAlgorithm: () => void;
        setAlgorithm: (algorithm: algorithmTypes) => void;
        currentAlgorithm: string;
        minDim: number;
        maxDim: number;
        block: boolean;
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
        clearBoard: () => void;
        clearPaths: () => void; 
        generateTarget: () => void;
        generateRandomMaze: () => void;
        generateRandomMazeWithRandomWeights: () => void;
        generateMaze: () => void;
    }

export const Header: React.FC<IHeader> = (
    { 
        clearBoard, 
        clearPaths, 
        generateRandomMaze, 
        generateRandomMazeWithRandomWeights,
        generateMaze,
        generateTarget,
        setWeight, 
        weight, 
        setDimensions, 
        startAlgorithm, 
        setAlgorithm, 
        currentAlgorithm,
        minDim,
        maxDim,
        block 
    }) => {
    
    const handleSettingAlgorithm = (algorithm: algorithmTypes) => {
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
                            <div onClick={() => handleSettingAlgorithm("Dijkstra")} className='Header__dropdown--element'><span>Dijkstra</span></div>
                            <div onClick={() => handleSettingAlgorithm('A*')} className='Header__dropdown--element'><span>A*</span></div>
                            <div onClick={() => handleSettingAlgorithm('Greedy')} className='Header__dropdown--element'><span>Greedy</span></div>
                            <div onClick={() => handleSettingAlgorithm('DFS')} className='Header__dropdown--element'><span>DFS</span></div>
                            <div onClick={() => handleSettingAlgorithm('Simple Math')} className='Header__dropdown--element'><span>Simple Math</span></div>
                        </div>
                    </div>
                <div className='Header__icon'>
                    <Weight onClick={handleWeightClick} className={`Header__icon--default ${weight.active ? 'Header__icon--default--active' : null}`} />
                    <input className='Header__icon--input'  onKeyPress={e => filterInputText(e)} onChange={e => onChangeHandle(e)} maxLength={2} placeholder='10' autoComplete='off' autoCorrect='off' />
                </div>


                <div className='Header__dropdown'>
                    <h1> Generate Maze </h1>
                    <p> &#8227; </p>
                    <div className='Header__dropdown--container'>
                        <div onClick={generateMaze} className='Header__dropdown--element'><span>Maze</span></div>
                        <div onClick={generateRandomMaze} className='Header__dropdown--element'><span>Random Maze</span></div>
                        <div onClick={generateRandomMazeWithRandomWeights} className='Header__dropdown--element'><span>Random Maze With Random Weights</span></div>
                    </div>
                </div>
            </div>
            <button className='Header__startButton' onClick={startAlgorithm}> START </button>
            <div className='Header__options'>
                        <input onChange={e => handleChange(e)} defaultValue={minDim} disabled={block}  type='range'  min={minDim} max={maxDim} className='Header__slider' />
                        <h1 onClick={generateTarget} className='Header__text'> TARGET </h1>
                        <h1 onClick={clearBoard} className='Header__text'> CLEAR BOARD </h1>
                        <h1 onClick={clearPaths} className='Header__text'> CLEAR PATHS </h1>
            </div>
        </div>
)}