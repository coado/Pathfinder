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
    isWeight: boolean,
    previousNode: INode | null,
}


interface IHandlers {
    onMouseDown: () => void;
    onMouseEnter: () => void;
    onMouseUp: () => void;
    dimension: number;
}

type PropsNode =  Partial<Omit<INode, 'distance' | 'previousNode'> & IHandlers>
   

export const Node: React.FC<PropsNode> = React.memo(({ row, col, isWeight, dimension, isStart, isEnd, isWall, onMouseDown, onMouseEnter, onMouseUp }) => {
    
    return (
        <div 
            className={`Node ${ isStart ? 'Node__start': isEnd ? 'Node__end' : isWall ? 'Node__wall' : ''}`}
            id={`node-${row}-${col}`}
            onMouseDown={onMouseDown}
            onMouseEnter={onMouseEnter}
            onMouseUp={onMouseUp}
            style={{'width': `${dimension}rem`, 'height': `${dimension}rem`}}
            >
        </div>
    )})
