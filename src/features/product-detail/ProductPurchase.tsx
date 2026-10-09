import { DemoButton } from "@/components/ui/Demo";
export function ProductPurchase() {
  return (
    <>
      <div className="pd-quantity">
        <p className="font-bold">{"Số lượng:"}</p>

        <div className="flex border border-[#E3E3E3] rounded-[4px] overflow-hidden">
          <input
            className="w-[50px] h-[50px] text-[16px] text-center leading-[22px] p-[13px_5px] border-r border-r-[#E3E3E3]"
            type="text"
            aria-label="Số lượng mua"
            value="1"
            min="1"
            max="999"
            readOnly
          />
          <div className="top-[1px] right-0 bottom-[0] w-[45px]">
            <DemoButton
              className="flex items-center justify-center w-full h-[24px] hover:[&_svg]:fill-[var(--color-primary)]"
              type="button"
              title="Thêm"
              aria-label="Thêm"
              data-demo=""
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="#000000"
              >
                <path d="M444-444H240v-72h204v-204h72v204h204v72H516v204h-72v-204Z"></path>
              </svg>
            </DemoButton>
            <div className="border-b w-full border-b-[#E3E3E3]"></div>
            <DemoButton
              className="flex items-center justify-center w-full h-[24px] hover:[&_svg]:fill-[var(--color-primary)]"
              type="button"
              title="Giảm"
              aria-label="Giảm"
              data-demo=""
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18px"
                viewBox="0 -960 960 960"
                width="18px"
                fill="#000000"
              >
                <path d="M232-444v-72h496v72H232Z"></path>
              </svg>
            </DemoButton>
          </div>
        </div>
      </div>
      <div className="pd-purchase">
        <DemoButton
          className="col-span-2 h-[56px] text-white text-[18px] leading-[56px] font-bold bg-[#ff0000] rounded-[4px] hover:bg-[#ea3511]"
          type="button"
          data-demo=""
        >
          {"\n            ĐẶT HÀNG\n          "}
        </DemoButton>

        <DemoButton
          className="h-[56px] text-[var(--color-primary)] text-[16px] leading-[56px] font-bold border border-[var(--color-primary)] rounded-[4px] hover:bg-[var(--color-primary)] hover:text-white"
          type="button"
          data-demo=""
        >
          {"\n            THÊM VÀO GIỎ\n          "}
        </DemoButton>

        <DemoButton
          className="h-[56px] text-white font-bold bg-[#1877F2] rounded-[4px] hover:bg-[#1169db]"
          type="button"
          data-demo=""
        >
          <p>{"TRẢ GÓP QUA HỒ SƠ"}</p>
          <p className="text-[13px] font-normal">
            {" Chỉ từ 6.997.334 VNĐ/tháng"}
          </p>
        </DemoButton>
      </div>
    </>
  );
}
