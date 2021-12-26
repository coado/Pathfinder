import React from 'react';
import './Node.scss'

export interface INode {
    col: number,
    row: number,
    isStart: boolean,
    isEnd: boolean,
    distance: number,
    isVisited: boolean,
    isWall: boolean,
    isWeight: {
        active: boolean,
        value: number
    },
    previousNode: INode | null,
}


interface IHandlers {
    onMouseDown: () => void;
    onMouseEnter: () => void;
    onMouseUp: () => void;
    dimension: number;
}

type PropsNode =  Partial<Omit<INode, 'distance' | 'previousNode'> & IHandlers>
   

export const Node: React.FC<PropsNode> = React.memo((
    { 
        row, 
        col, 
        isWeight,
        dimension, 
        isVisited,
        isStart, 
        isEnd, 
        isWall, 
        onMouseDown, 
        onMouseEnter, 
        onMouseUp 
    }) => {

        const weightColor = (value: number) => {
            if (value <= 20) return 'lightBlue'
            if (value <= 40) return 'blue'
            if (value <= 60) return 'orange'
            if (value <= 80) return 'pink'
            return 'red'
        }

        const getClass = () => {
            if (isStart) return 'Node__start'
            if (isEnd) return 'Node__end'
            if (isWeight?.active) return `Node__weight Node__weight--${weightColor(isWeight.value)}`
            if (isWall) return 'Node__wall'
            return ''
        }
    
    return (
        <div 
            className={`Node ${getClass()}`}
            id={`node-${row}-${col}`}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
            style={
                {   'width': `${dimension}rem`, 
                    'height': `${dimension}rem`,
                }}
            >
            {
                isWeight && isWeight.active && isWeight.value
            }
            
        </div>
    )})
