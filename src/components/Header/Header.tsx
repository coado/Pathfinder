import './Header.styles.scss';

interface IHeader {
        startAlgorithm: () => void;
        setAlgorithm: (algorithm: string) => void;
        currentAlgorithm: string;
        setWeight: () => void;
        setDimensions: (value: {
            rows: number;
            columns: number;
        }) => void 
    }

export const Header: React.FC<IHeader> = ({ setWeight, setDimensions, startAlgorithm, setAlgorithm, currentAlgorithm }) => {
    
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

    return (
        <div className='Header'>
            <div className='Header__options'>
                <div className='Header__dropdown'>
                        <h1>{ currentAlgorithm }</h1>
                        <p> &#8227; </p>
                    <div className='Header__dropdown--container'>
                        <div onClick={() => handleSettingAlgorithm('Dijsktra')} className='Header__dropdown--element'>Dijsktra</div>
                        <div onClick={() => handleSettingAlgorithm('Astar')} className='Header__dropdown--element'>Astar</div>
                        <div className='Header__dropdown--element'>Element</div>
                        <div className='Header__dropdown--element'>Element</div>
                    </div>
                </div>

                <div className='Header__weight'>
                    <img onClick={setWeight} className='Header__weight--icon' src='../images/weight.png' alt='weight' />
                </div>
            </div>
            <button className='Header__startButton' onClick={startAlgorithm}> START </button>
            <div className='Header__options'>
                    <div>
                        <input onChange={e => handleChange(e)} defaultValue='25'  type='range'  min='25' max='35' className='Header__slider' />
                    </div>        
            </div>
        </div>
)}