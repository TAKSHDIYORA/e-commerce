import React from 'react'
import axios from 'axios'

const generateInvoices = async(invoiceData) => {
   const response = await axios.post("https://invoice-generator.com",
    invoiceData,
    {
      headers: {
         ApiKey : "fX0fiCzI8rO3VPYmdvzUsoD7k7r1YQ",
         "Content-Type": "application/json"
      }
    })

  return (
    <div>
      
    </div>
  )
}

export default generateInvoices
