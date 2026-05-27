import { motion } from 'framer-motion'
import type snippet from '../../interfaces/snippet'

interface SnippetFullViewProps {
    snippet: snippet
}
export default function SnippetFullView({snippet}: SnippetFullViewProps){
    return(
        <motion.div
        className='w-full md:w-[70%] min-h-0'
        >
            <div>
                {snippet.code}
            </div>
            <div>
                //code details in here
            </div>
        </motion.div>
    )
}