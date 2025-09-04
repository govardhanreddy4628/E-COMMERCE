import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import styles from "./ProductCellRenderer.module.css";

export const ProductCellRenderer: FunctionComponent<CustomCellRendererProps> = ({ value, data: { image, category } }) => (
  <div className={styles.productCell}>
    <div className={styles.image}>
      <img src={`https://th.bing.com/th/id/OIP.Qtd1vbWR1O9mFYIIcGmdTwHaHa?w=151&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3`} alt={image} />
    </div>
    <div>
      <div>{value}</div>
      <div className={styles.stockCell}>{category}</div>
    </div>
  </div>
);