"use client"
import CategoryForm from "@/components/forms/categoryForm";
import SubCategoryForm from "@/components/forms/subCategoryForm";
import { fetchCategories, selectCategories } from "@/redux/category/categorySlice";
import { AppDispatch } from "@/redux/store";
import { fetchSubCategories, selectSubCategories } from "@/redux/subCategory/subCategorySlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Categories() {

    const dispatch = useDispatch<AppDispatch>()
    const categories = useSelector(selectCategories)
    const subCategories = useSelector(selectSubCategories)

    useEffect(() => {
        dispatch(fetchCategories())
        dispatch(fetchSubCategories())
    }, [])

    return <div className="grid grid-cols-6 gap-4">
        <div className="col-span-4">
            <div>
                <h1>Categories</h1>
                <div>
                    {
                        categories.map(categ => (<p key={categ.id}>
                            {categ.name}
                        </p>))
                    }
                </div>
            </div>
            <div className="border-t">
                <h1>Sub categories</h1>
                <div>
                    {
                        subCategories.map(subCateg => (<p key={subCateg.id}>
                            {subCateg.name}
                        </p>))
                    }
                </div>
            </div>
        </div>
        <div className="col-span-2 pt-4">
            <CategoryForm />
            <div className="h-5"></div>
            <SubCategoryForm />
        </div>
    </div>
}