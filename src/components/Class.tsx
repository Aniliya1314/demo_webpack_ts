import { PureComponent } from "react"
import type { ComponentClass } from "react"

/**装饰器为组件添加age属性*/
function addAge(Target: ComponentClass) {
	Target.prototype.age = 111
}

/**使用装饰器*/
@addAge
class Class extends PureComponent {
	age?: number

	render() {
		return <h2>我是类组件---{this.age}</h2>
	}
}

export default Class
