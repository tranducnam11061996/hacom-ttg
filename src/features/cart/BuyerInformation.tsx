import { cartData } from "@/data";
export function BuyerInformation() {
  const fields = [
    { id: "name", label: "Họ tên", type: "text" },
    { id: "phone", label: "SĐT", type: "tel" },
    { id: "email", label: "Email", type: "email" },
    { id: "address", label: "Địa chỉ", type: "textarea" },
    { id: "province", label: "Tỉnh/Thành phố", type: "select" },
    { id: "district", label: "Quận/Huyện", type: "select" },
    { id: "note", label: "Ghi chú", type: "textarea" },
  ];
  return (
    <section className="cart-buyer" aria-labelledby="cart-buyer-title">
      <h2 id="cart-buyer-title" className="cart-column-title">
        {cartData.labels.buyer}
      </h2>
      <p className="cart-buyer-hint">{cartData.labels.buyerHint}</p>
      <table className="cart-buyer-fields">
        <tbody>
          {fields.map((f) => (
            <tr key={f.id}>
              <td>
                <label htmlFor={`cart-${f.id}`}>
                  {f.label}
                  {f.id !== "note" && <span className="cart-required">*</span>}
                </label>
              </td>
              <td>
                {f.type === "textarea" ? (
                  <textarea
                    id={`cart-${f.id}`}
                    className={f.id === "note" ? "cart-note" : undefined}
                    autoComplete="off"
                  />
                ) : f.type === "select" ? (
                  <select id={`cart-${f.id}`}>
                    {f.id === "province" ? (
                      cartData.provinces.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.name}
                        </option>
                      ))
                    ) : (
                      <option value="0">Chọn Quận/Huyện</option>
                    )}
                  </select>
                ) : (
                  <input id={`cart-${f.id}`} type={f.type} autoComplete="off" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
