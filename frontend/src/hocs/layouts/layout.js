

import { connect } from "react-redux"
import {motion} from 'framer-motion'

function Layout({children}){
    return(
        <motion.div
        initial={{opacity: 0, transition: {duration: 1}}}
        animate={{opacity: 1}}
        exit={{opacity: 0, transition: {duration: 1}}}
        >
            
            {children}
        </motion.div>
    )
}

const mapStateToProps = state =>({

})

export default connect(mapStateToProps,{

}) (Layout)