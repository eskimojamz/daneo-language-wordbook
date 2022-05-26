import Svg, { Path } from 'react-native-svg'

const Plus = () => {
    return (
        <>
            <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <Path d="M5 16H27" stroke='#8085E7' strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
                <Path d="M16 5V27" stroke='#8085E7' strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
        </>
    )
}

export default Plus
