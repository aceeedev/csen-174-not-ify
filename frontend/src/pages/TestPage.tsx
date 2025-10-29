import { useState } from 'react'

function TestPage() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Test Case</h1>
      <div>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default TestPage
