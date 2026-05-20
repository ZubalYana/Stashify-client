const styles = {
  sm: {
    img: 'w-[30px] h-[30px]',
    text: 'text-[24px]', 
  },
  md: {
    img: 'w-[40px] h-[40px]',
    text: 'text-[28px]',
  },
}

interface WordMarkLogoProps {
  size: 'sm' | 'md'
}

export default function WordMarkLogo({ size }: WordMarkLogoProps) {
  const s = styles[size]
  return (
    <div className="flex items-center gap-x-2">
      <img src="/StashifyLogo.png" alt="Stashify Logo" className={s.img} />
      <h3 className={`${s.text} font-medium`}>
        Stash<span className="text-[#F07020]">ify</span>
      </h3>
    </div>
  )
}