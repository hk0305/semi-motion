import { BaseComponent, Component } from "../component.js";
import { Composable } from "../page/page.js";

type OnCloseListener = () => void;
type OnSubmitListener = () => void;

export class InputDialog
  extends BaseComponent<HTMLElement>
  implements Composable
{
  closeListener?: OnCloseListener;
  submitListener?: OnSubmitListener;

  constructor() {
    super(`<dialog class="dialog">
            <div class="dialog__container">
                <button class="close">&times;</button>
                <div class="dialog__body"></div>
                <button class="dialog__submit">ADD</button>
            </div>
           </dialog>`);
    const closeBtn = this.element.querySelector(".close")! as HTMLElement;

    // onclick() 이벤트는 해당 버튼이 다른 곳에서 정의가 된다면 덮어 씌여진다.
    // 따라서 다수의 클릭 이벤트를 동작할 때는 addEventListener를 사용하자.
    // closeBtn.addEventListener("click", "");
    closeBtn.onclick = () => {
      // closeListener가 있으면 closeListener()를 실행한다.
      this.closeListener && this.closeListener();
    };

    const submitBtn = this.element.querySelector(
      ".dialog__submit"
    )! as HTMLElement;

    submitBtn.onclick = () => {
      this.submitListener && this.submitListener();
    };
  }

  setOnCloseLinstener(listener: OnCloseListener) {
    this.closeListener = listener;
  }
  setOnSubmitLinstener(listener: OnSubmitListener) {
    this.submitListener = listener;
  }

  addChild(child: Component) {
    const body = this.element.querySelector("#dialog__body")! as HTMLElement;
    child.attachTo(body);
  }
}
