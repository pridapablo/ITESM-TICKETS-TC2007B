interface Subcategory {
    subclassification: string;
    count: number;
  }
  
  interface Category {
    _id: string;
    totalCount: number;
    subcategories: Subcategory[];
  }
  
  interface TransformedSubcategory {
    name: string;
    color: string;
    loc: number;
  }
  
  interface TransformedCategory {
    name: string;
    color: string;
    children: TransformedSubcategory[];
  }

  interface TransformedDataWrapper {
    name: string;
    color: string;
    children: TransformedCategory[];
  }      