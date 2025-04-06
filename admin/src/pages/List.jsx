import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {TbTrash} from "react-icons/tb"

const List = () => {

  const url = "http://localhost:4000"
  const [list, setList] = useState([])
  const fetchList = async()=>{
    const response = await axios.get(`${url}/api/product/list`)
    // console.log(response.data)
    if(response.data.success){
      setList(response.data.data)
    } else {
      toast.error("Error")
    }
  }

  const removeProduct = async(productId)=>{
    const response = await axios.post(`${url}/api/product/remove`, {id:productId})
    await fetchList()
    if(response.data.success){
      toast.success(response.data.message)
    }else{
      toast.error()
    }
  }

  useEffect(()=>{
    fetchList()
  },[])

  return (
    <section className='p-6 sm:p-10 w-full'>
      <h4 className='text-2xl font-bold uppercase text-gray-800 mb-6'>Products List</h4>
      <div className='overflow-auto'>
        <table className='w-full table-auto border-collapse'>
          <thead>
            <tr className='bg-gray-100 text-gray-600 text-sm uppercase tracking-wider'>
              <th className='text-left px-4 py-3'>Image</th>
              <th className='text-left px-4 py-3'>Title</th>
              <th className='text-left px-4 py-3'>Price</th>
              <th className='text-left px-4 py-3'>Remove</th>
            </tr>
          </thead>
          <tbody className='text-gray-800 text-sm'>
            {list.map((product) => (
              <tr key={product._id} className='border-b border-gray-200 hover:bg-gray-10'>
                <td className='px-4 py-3 align-middle'>
                  <div className='w-12 h-12 flex items-center justify-center overflow-hidden rounded-md border border-gray-200'>
                    <img
                      src={`${url}/images/` + product.image}
                      alt=""
                      className='object-cover w-full h-full'
                    />
                  </div>
                </td>
                <td className='px-4 py-3 align-middle'>
                  <div className='line-clamp-3 font-medium'>{product.name}</div>
                </td>
                <td className='px-4 py-3 align-middle font-semibold text-green-600'>${product.price}</td>
                <td className='px-4 py-3 align-middle'>
                  <button onClick={() => removeProduct(product._id)} className='text-red-500 hover:text-red-700 text-xl'>
                    <TbTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default List