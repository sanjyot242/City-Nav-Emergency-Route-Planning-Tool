import { locations, list } from '../data';

function CustomInput({ setStart, setEnd, onClick, buttonTitle, children }) {
  return (
    // <div className='w-full md:w-1/4 xl:w-1/5 p-4 bg-gray-100 overflow-auto'>
    <div className='py-4 px-2'>
      <h2 className='text-center  text-xl  font-bold my-2'>{children}</h2>
      <div className='mb-4'>
        <label
          htmlFor='start-point'
          className='block text-sm font-medium text-gray-700'>
          Select Source
        </label>
        <select
          id='start-point'
          className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
          onChange={(e) => setStart(e.target.value)}>
          <option value=''>Select Source</option>
          {locations.map((location, idx) => (
            <option key={idx} value={location.name}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className='mb-4'>
        <label
          htmlFor='end-point'
          className='block text-sm font-medium text-gray-700'>
          Select Destination
        </label>
        <select
          id='end-point'
          className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
          onChange={(e) => setEnd(e.target.value)}>
          <option value=''>Select Destination</option>
          {locations.map((location, idx) => (
            <option key={idx} value={location.name}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        onClick={onClick}>
        {buttonTitle}
      </button>
    </div>
    // </div>
  );
}

export default CustomInput;
