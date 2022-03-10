import {RefObject, useEffect, useRef, useState} from 'react'

interface UseScrollingUpOptions {
    defaultState?: boolean
    threshold?: number;
}

export const useScrollingUp = (refEl: RefObject<HTMLElement>, options: UseScrollingUpOptions = {}): boolean => {
    const prevScroll = useRef<number>(refEl.current?.scrollTop || 0)
    const [isScrollingUp, setScrollingUp] = useState<boolean | null>(options.defaultState || null)

    useEffect(() => {
        const el = refEl.current

        if(el) {
            const handleScroll = () => {
                const currScroll = el.scrollTop

                if(currScroll > (options?.threshold || 0)) {
                    const isScrolled = prevScroll.current > currScroll

                    setScrollingUp(isScrolled)
                    prevScroll.current = currScroll
                }
            }

            el.addEventListener('scroll', handleScroll, { passive: true })

            return () => {
                el.removeEventListener('scroll', handleScroll )
            }
        }
    }, [options?.threshold, refEl])

    return !!isScrollingUp
}
//
// export const useScrollingUpWithOffset = (refEl: RefObject<HTMLElement>): [boolean, number] => {const prevScroll = useRef<number>(refEl.current?.scrollTop || 0)
//     const prevScroll = useRef<number>(refEl.current?.scrollTop || 0)
//     const [isScrollingUp, setScrollingUp] = useState<any>(null)
//
//     useEffect(() => {
//         const el = refEl.current
//
//         if(el) {
//             const handleScroll = () => {
//                 const currScroll = el.scrollTop
//                 const isScrolled = prevScroll.current > currScroll
//
//                 setScrollUp((prevScrollUp: any) => {
//                     if(isScrolled) {
//                         return prevScrollUp || currScroll
//                     } else {
//                         return null
//                     }
//                 })
//                 prevScroll.current = currScroll
//             }
//
//             el.addEventListener('scroll', handleScroll, { passive: true })
//
//             return () => {
//                 el.removeEventListener('scroll', handleScroll )
//             }
//         }
//     }, [refEl])
//
//     return isScrollingUp
//     const prevScroll = useRef<number>(refEl.current?.scrollTop || 0)
//     const [isScrollingUp, setScrollingUp] = useState<any>(null)
//
//     useEffect(() => {
//         const el = refEl.current
//
//         if(el) {
//             const handleScroll = () => {
//                 const currScroll = el.scrollTop
//                 const isScrolled = prevScroll.current > currScroll
//
//                 setScrollingUp(isScrolled)
//                 prevScroll.current = currScroll
//             }
//
//             el.addEventListener('scroll', handleScroll, { passive: true })
//
//             return () => {
//                 el.removeEventListener('scroll', handleScroll )
//             }
//         }
//     }, [refEl])
//
//
//     const isScrollingUp = useScrollingUp(refEl)
//     const prevScroll = useRef<number>(refEl.current?.scrollTop || 0)
//     const [scrollUpOffset, setScrollUpOffset] = useState(0)
//
//     useEffect(() => {
//         if(isScrollingUp) {
//             console.log('up', refEl.current?.scrollTop)
//         } else {
//             setScrollUpOffset(0)
//             console.log('down', refEl.current?.scrollTop)
//         }
//     }, [refEl, isScrollingUp])
//
//     return [isScrollingUp, scrollUp]
// }
