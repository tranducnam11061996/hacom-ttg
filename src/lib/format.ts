const money = new Intl.NumberFormat("vi-VN");
export const formatMoney = (value: number) => money.format(value);
