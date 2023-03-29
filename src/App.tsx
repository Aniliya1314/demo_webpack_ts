import { lazy, Suspense, useState } from "react"
import Class from "./components/Class"
import smallImg from "@/assets/images/logo192.png"
import bigImg from "@/assets/images/logo512.png"
// import "./app.less";

const LazyDemo = lazy(() => import("@/components/LazyDemo"))
const PrefetchDemo = lazy(
	() =>
		import(
			/* webpackChunkName: "PrefetchDemo" */
			/* webpackPrefetch: true */
			"@/components/PrefetchDemo"
		)
)

const PreloadDemo = lazy(
	() =>
		import(
			/* webpackChunkName: "PreloadDemo" */
			/* webpackPreload: true */
			"@/components/PreloadDemo"
		)
)

function App() {
	const [show, setShow] = useState<boolean>(false)

	const onClick = () => {
		import("./app.less")
		setShow(true)
	}

	return (
		<>
			<Class />
			<h2>demo_webpack_ts</h2>
			<img src={smallImg} alt='小图像' />
			<img src={bigImg} alt='大图像' />
			<div className='smallImg'></div>
			<button onClick={onClick}>展示懒加载组件</button>
			{show && (
				<>
					<Suspense fallback={null}>
						<LazyDemo />
					</Suspense>
					<Suspense fallback={null}>
						<PreloadDemo />
					</Suspense>
					<Suspense fallback={null}>
						<PrefetchDemo />
					</Suspense>
				</>
			)}
		</>
	)
}

export default App
