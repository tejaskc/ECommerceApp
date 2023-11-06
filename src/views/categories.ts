import { useToast } from "vue-toast-notification";
import { ref } from "vue";
import axios from "axios";
const $toast = useToast();

interface categoryType {
  category_name: string;
  image: string;
}
const categories = ref<categoryType[]>([]);

const getCategories = async () => {
  categories.value = [];
  const response = await axios.get(
    "https://fakestoreapi.com/products/categories"
  );
  if (response.status == 200) {
    const categoriesData = response.data;
    const products = await axios.get(
      "https://fakestoreapi.com/products?sort=desc"
    );
    if (products.status == 200) {
      categoriesData.forEach((cat) => {
        let product = products.data.find((pro) => pro.category === cat);
        categories.value.push({
          category_name: product.category,
          image: product.image,
        });
      });
    } else {
      return $toast.error(products.statusText);
    }
  } else {
    return $toast.error(response.statusText);
  }
};

export { categories, getCategories };
