import './Footer.styles.scss';
import {ReactComponent as GithubIcon} from '../../svg/github.svg';

export const Footer = () => {

    return (
        <div className='Footer'>
            <h3 className='Footer__copyright'>@2022</h3>
            <a className='Footer__github' target='blank' href='https://github.com/coado/Pathfinder'><GithubIcon /></a>
        </div>
    )
}