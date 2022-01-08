import './TutorialWindow.styles.scss';
import content from './content.json';
import { useState, useRef } from 'react';


export const TutorialWindow = ({ setTutorialWindow }: { setTutorialWindow: () => void}) => {

    let itemRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const data: Record<string, string>[] = Object.values(content);

    const handlePageChange = (value: number) => setCurrentPage(prevState => prevState + value)

    const closeWindow = () => {
        if (inputRef.current?.checked) window.localStorage.setItem('tutorial', JSON.stringify(false))
        setTutorialWindow()
    }

    const mouseClickHandling = (e: React.MouseEvent<HTMLDivElement>) => {
        let target: any = e.target
        if ( itemRef.current && !itemRef.current.contains(target)) closeWindow()
    }

    return (
        <div onClick={mouseClickHandling} className='TutorialWindow__container'>
            <div ref={itemRef} className='TutorialWindow'>
                <span onClick={closeWindow} className='TutorialWindow__close'>&#10006;</span>
                <h1 className='TutorialWindow__title'>{ data[currentPage].header }</h1>
                <h2 className='TutorialWindow__text'>{ data[currentPage].text }</h2>
                {
                    data[currentPage].contentType === 'image' ?
                        <img className='TutorialWindow__image' src={`../images/${currentPage}.png`} alt='0'  />
                    : 
                        <video autoPlay={true} muted loop className='TutorialWindow__image' src={`../images/${currentPage}.mp4`}></video>
                }
                    {
                        currentPage ? 
                            <img onClick={() => handlePageChange(-1)} className='TutorialWindow__arrow TutorialWindow__arrow--left' src={`../images/arrow.png`} alt='arrow'  />
                        : null 
                    }
                    {
                        currentPage !== data.length-1 ?
                            <img onClick={() => handlePageChange(1)} className='TutorialWindow__arrow TutorialWindow__arrow--right' src={`../images/arrow.png`} alt='arrow'  />
                        : null

                    }
                <div className='TutorialWindow__checkbox'>
                    <input ref={inputRef} type="checkbox" />
                    <label> Don't show it again </label>
                </div>  
                <span className='TutorialWindow__pageNumber'>{currentPage+1} / {data.length}</span>

            </div>
        </div>
    )
}