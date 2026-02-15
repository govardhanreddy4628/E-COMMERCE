// RecursiveCategorySelector.tsx
import { useEffect, useState } from "react";

import { UseFormReturn } from "react-hook-form";
import { Category } from "../../types/category";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../ui/select";

interface Props {
  categories: Category[];
  form: UseFormReturn<any>;
  fieldName: string; // "category"
  onLeafChange?: (id: string) => void;
}

export default function RecursiveCategorySelector({
  categories,
  form,
  fieldName,
  onLeafChange,
}: Props) {
  const [path, setPath] = useState<Category[]>([]);

  const selectedLeafId = form.watch(fieldName);

  // -------- helper: find full path to a leaf --------
  const findPathToCategory = (
    cats: Category[],
    targetId: string,
    currentPath: Category[] = []
  ): Category[] | null => {
    for (const cat of cats) {
      const nextPath = [...currentPath, cat];

      if (String(cat._id) === String(targetId)) {
        return nextPath;
      }

      if (cat.subcategories?.length) {
        const found = findPathToCategory(cat.subcategories, targetId, nextPath);
        if (found) return found;
      }
    }
    return null;
  };


  useEffect(() => {
  if (!selectedLeafId) {
    setPath([]);
  }
}, [selectedLeafId]);

  // -------- EDIT MODE: restore path from saved leaf id --------
  useEffect(() => {
    if (!selectedLeafId || !categories.length) return;

    const restoredPath = findPathToCategory(categories, selectedLeafId);

    if (restoredPath) {
      setPath(restoredPath);
    }
  }, [selectedLeafId, categories]);

  // -------- when path changes, update form with leaf --------
  useEffect(() => {
    const leaf = path[path.length - 1];
    if (leaf && leaf._id) {
      form.setValue(fieldName, leaf._id, { shouldValidate: true });
      onLeafChange?.(leaf._id);
    }
  }, [path, form, fieldName, onLeafChange]);

  // -------- handle select change at a level --------
  const handleSelect = (level: number, id: string) => {
    const base = path.slice(0, level);
    const source = level === 0 ? categories : path[level - 1].subcategories;
    const selected = source?.find(c => String(c._id) === String(id));

    if (!selected) return;

    setPath([...base, selected]);
  };

  // -------- render dropdowns --------
  const levels: Category[][] = [];
  levels.push(categories);

  for (let i = 0; i < path.length; i++) {
    if (path[i].subcategories?.length) {
      levels.push(path[i].subcategories);
    }
  }

  return (
    <div className="space-y-3">
      {levels.map((cats, level) => (
        <Select
          key={level}
          value={path[level]?._id ?? ""}
          onValueChange={value => handleSelect(level, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select category level ${level + 1}`} />
          </SelectTrigger>
          <SelectContent>
            {cats.map(cat => (
              cat._id && (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              )
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
