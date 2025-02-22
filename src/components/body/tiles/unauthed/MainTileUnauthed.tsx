import { motion } from "framer-motion"
import { default as calendar } from "/src/assets/calendar.png"

export const MainTileUnauthed = () => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.6,
      }}
      className="flex shrink-0 flex-col justify-evenly gap-4 overflow-clip rounded-md border border-yellow-600 bg-red-900 bg-opacity-50 p-4 sm:flex-row"
      style={{
        backdropFilter: "blur(16px)",
      }}
    >
      <div className="grid h-full place-content-center sm:w-1/2">
        <div className="rounded-md border border-yellow-600 bg-red-800 bg-opacity-50 p-5 text-xl font-semibold text-stone-100 sm:text-2xl md:text-3xl lg:font-bold">
          Simple Meal Tracking
          <ul className="grid list-square place-content-center py-2 pl-4 gap-1 text-lg font-normal text-stone-50 sm:font-semibold md:text-xl lg:font-bold">
            <li>Schedule future meals</li>
            <li>Check off feedings</li>
            <li>View the history</li>
          </ul>
        </div>
      </div>
      <div className="grid place-content-center sm:w-1/3">
        <img
          src={calendar}
          alt="calendar"
          className="rounded-md border border-yellow-500"
        />
      </div>
    </motion.div>
  )
}
