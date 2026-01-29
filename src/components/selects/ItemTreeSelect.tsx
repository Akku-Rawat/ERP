import React, { useEffect, useRef, useState } from "react";


const USE_DUMMY_DATA = false;


interface TreeItem {
  code: string;
  name: string;
  level: number;
  children: TreeItem[];
  originalData: any;
}

interface Props {
  value?: string;
  onChange: (item: { name: string; id: string }) => void;
  fetchData: () => Promise<any>;
  label: string;
  placeholder?: string;
  className?: string;
  displayFormatter?: (option: any) => string;
}

const getDummyData = () => ({
  data: {
    itemClsList: [
      {
        itemClsCd: "10000000",
        itemClsNm:
          "Live Plant and Animal Material and Accessories and Supplies",
        itemClsLvl: 1,
        useYn: "Y",
      },
      {
        itemClsCd: "11000000",
        itemClsNm:
          "Mineral and Textile and Inedible Plant and Animal Materials",
        itemClsLvl: 1,
        useYn: "Y",
      },
      {
        itemClsCd: "12000000",
        itemClsNm: "Chemicals including Bio Chemicals and Gas Materials",
        itemClsLvl: 1,
        useYn: "Y",
      },
      {
        itemClsCd: "10100000",
        itemClsNm: "Live animals",
        itemClsLvl: 2,
        useYn: "Y",
      },
      {
        itemClsCd: "10110000",
        itemClsNm: "Domestic pet food and supplies and accessories",
        itemClsLvl: 2,
        useYn: "Y",
      },
      {
        itemClsCd: "10120000",
        itemClsNm: "Horticulture",
        itemClsLvl: 2,
        useYn: "Y",
      },
      {
        itemClsCd: "11100000",
        itemClsNm: "Mineral ores",
        itemClsLvl: 2,
        useYn: "Y",
      },
      {
        itemClsCd: "11110000",
        itemClsNm: "Leather and fur and textile materials",
        itemClsLvl: 2,
        useYn: "Y",
      },
      { itemClsCd: "12100000", itemClsNm: "Gases", itemClsLvl: 2, useYn: "Y" },
      {
        itemClsCd: "12110000",
        itemClsNm: "Organic chemicals",
        itemClsLvl: 2,
        useYn: "Y",
      },
      {
        itemClsCd: "10101000",
        itemClsNm: "Livestock",
        itemClsLvl: 3,
        useYn: "Y",
      },
      { itemClsCd: "10101500", itemClsNm: "Birds", itemClsLvl: 3, useYn: "Y" },
      {
        itemClsCd: "10102000",
        itemClsNm: "Fish and aquatic invertebrates",
        itemClsLvl: 3,
        useYn: "Y",
      },
      {
        itemClsCd: "10111000",
        itemClsNm: "Domestic pet food",
        itemClsLvl: 3,
        useYn: "Y",
      },
      {
        itemClsCd: "10111500",
        itemClsNm: "Domestic animal accessories",
        itemClsLvl: 3,
        useYn: "Y",
      },
      {
        itemClsCd: "11101000",
        itemClsNm: "Iron ores",
        itemClsLvl: 3,
        useYn: "Y",
      },
      {
        itemClsCd: "11101500",
        itemClsNm: "Copper ores",
        itemClsLvl: 3,
        useYn: "Y",
      },
      {
        itemClsCd: "12101000",
        itemClsNm: "Industrial gases",
        itemClsLvl: 3,
        useYn: "Y",
      },
      {
        itemClsCd: "12101500",
        itemClsNm: "Medical gases",
        itemClsLvl: 3,
        useYn: "Y",
      },
      { itemClsCd: "10101501", itemClsNm: "Cattle", itemClsLvl: 4, useYn: "Y" },
      { itemClsCd: "10101502", itemClsNm: "Horses", itemClsLvl: 4, useYn: "Y" },
      { itemClsCd: "10101503", itemClsNm: "Sheep", itemClsLvl: 4, useYn: "Y" },
      { itemClsCd: "10101504", itemClsNm: "Goats", itemClsLvl: 4, useYn: "Y" },
      { itemClsCd: "10101505", itemClsNm: "Swine", itemClsLvl: 4, useYn: "Y" },
      {
        itemClsCd: "10101601",
        itemClsNm: "Chickens",
        itemClsLvl: 4,
        useYn: "Y",
      },
      { itemClsCd: "10101602", itemClsNm: "Ducks", itemClsLvl: 4, useYn: "Y" },
      {
        itemClsCd: "10101603",
        itemClsNm: "Turkeys",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "10102001",
        itemClsNm: "Live ornamental fish",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "10102002",
        itemClsNm: "Live food fish",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "10102003",
        itemClsNm: "Shellfish",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "10111001",
        itemClsNm: "Dog food",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "10111002",
        itemClsNm: "Cat food",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "10111003",
        itemClsNm: "Bird food",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "11101001",
        itemClsNm: "Hematite",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "11101002",
        itemClsNm: "Magnetite",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "11101003",
        itemClsNm: "Limonite",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "11101501",
        itemClsNm: "Chalcopyrite",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "11101502",
        itemClsNm: "Bornite",
        itemClsLvl: 4,
        useYn: "Y",
      },
      { itemClsCd: "12101001", itemClsNm: "Oxygen", itemClsLvl: 4, useYn: "Y" },
      {
        itemClsCd: "12101002",
        itemClsNm: "Nitrogen",
        itemClsLvl: 4,
        useYn: "Y",
      },
      { itemClsCd: "12101003", itemClsNm: "Argon", itemClsLvl: 4, useYn: "Y" },
      {
        itemClsCd: "12101004",
        itemClsNm: "Carbon dioxide",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "12101501",
        itemClsNm: "Medical oxygen",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "12101502",
        itemClsNm: "Nitrous oxide",
        itemClsLvl: 4,
        useYn: "Y",
      },
      {
        itemClsCd: "12101503",
        itemClsNm: "Medical air",
        itemClsLvl: 4,
        useYn: "Y",
      },
    ],
  },
});

export default function ItemTreeSelect({
  value = "",
  onChange,
  fetchData,
  label,
  placeholder = "Search...",
  className = "",
  displayFormatter,
}: Props) {
  const [treeData, setTreeData] = useState<TreeItem[]>([]);
  const [filteredTree, setFilteredTree] = useState<TreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement>(null);

  const getId = (item: any): string =>
    item.itemClsCd ?? item.code ?? String(item);
  const getName = (item: any): string =>
    item.itemClsNm ?? item.name ?? item.code_name ?? "";
  const getLevel = (item: any): number =>
    Number(item.itemClsLvl ?? item.level ?? 1);

  const getDisplayName = (item: any): string => {
    if (displayFormatter) return displayFormatter(item);
    const code = getId(item);
    const name = getName(item);
    return code && name ? `${code} - ${name}` : name || code;
  };

  const buildTree = (flatList: any[]): TreeItem[] => {
    const map: Record<string, TreeItem> = {};
    const roots: TreeItem[] = [];

    flatList
      .filter((item) => item.useYn === "Y" || item.useYn === true)
      .forEach((item) => {
        const code = getId(item);
        const level = getLevel(item);
        map[code] = {
          code,
          name: getDisplayName(item),
          level,
          children: [],
          originalData: item,
        };
      });

    Object.values(map).forEach((node) => {
      if (node.level === 1) {
        roots.push(node);
        return;
      }
      let parentCode: string | null = null;
      if (node.level === 2) parentCode = node.code.slice(0, 2) + "000000";
      else if (node.level === 3) parentCode = node.code.slice(0, 4) + "0000";
      else if (node.level === 4) parentCode = node.code.slice(0, 6) + "00";
      if (parentCode && map[parentCode]) map[parentCode].children.push(node);
    });

    const sortTree = (nodes: TreeItem[]): TreeItem[] =>
      nodes
        .sort((a, b) => a.code.localeCompare(b.code))
        .map((n) => ({ ...n, children: sortTree(n.children) }));

    return sortTree(roots);
  };

  const searchTree = (nodes: TreeItem[], term: string): TreeItem[] => {
    if (!term.trim()) return nodes;
    const lower = term.toLowerCase();
    return nodes
      .map((node) => {
        const match =
          node.code.toLowerCase().includes(lower) ||
          node.name.toLowerCase().includes(lower);
        if (match) return { ...node };
        const children = searchTree(node.children, term);
        return children.length ? { ...node, children } : null;
      })
      .filter((n): n is TreeItem => n !== null);
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        let res;
        if (USE_DUMMY_DATA) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          res = getDummyData();
        } else {
          res = await fetchData();
        }
        let data =
          res?.data?.itemClsList ??
          res?.data?.data?.itemClsList ??
          res?.data?.data?.list ??
          res?.data?.data?.items ??
          res?.data?.data ??
          res?.data ??
          res;

        if (!Array.isArray(data)) {
          console.error("Invalid ItemClass response shape", res);
          data = [];
        }

        const tree = buildTree(data);
        setTreeData(tree);
        setFilteredTree(tree);
        const exp: Record<string, boolean> = {};
        tree.forEach((node) => (exp[node.code] = true));
        setExpanded(exp);
      } catch (err) {
        console.error("Load error:", err);
        setTreeData([]);
        setFilteredTree([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchData]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredTree(treeData);
      return;
    }
    const results = searchTree(treeData, search);
    setFilteredTree(results);
    const exp: Record<string, boolean> = {};
    const expandAll = (nodes: TreeItem[]) => {
      nodes.forEach((n) => {
        exp[n.code] = true;
        expandAll(n.children);
      });
    };
    expandAll(results);
    setExpanded((prev) => ({ ...prev, ...exp }));
  }, [search, treeData]);

  const toggleNode = (code: string) =>
    setExpanded((prev) => ({ ...prev, [code]: !prev[code] }));

  const findSelectedItem = (code: string): TreeItem | null => {
    const findInTree = (nodes: TreeItem[]): TreeItem | null => {
      for (const node of nodes) {
        if (node.code === code) return node;
        const found = findInTree(node.children);
        if (found) return found;
      }
      return null;
    };
    return findInTree(treeData);
  };

  const selectedItem = findSelectedItem(value);
  const displayValue = selectedItem ? selectedItem.name : "";

const levelColors = [
  "bg-primary/10 text-primary border-primary/20",
  "bg-primary/10 text-primary border-primary/20",
  "bg-primary/10 text-primary border-primary/20",
  "bg-primary/10 text-primary border-primary/20",
];


  const renderTreeNode = (
    node: TreeItem,
    depth: number = 0,
  ): React.JSX.Element => {
    const isExpanded = expanded[node.code];
    const hasChildren = node.children.length > 0;
    const isSelected = node.code === value;
    const isLeaf = node.level === 4 || !hasChildren;

    return (
      <div key={node.code} style={{ marginLeft: `${depth * 16}px` }}>
        <div
      className={`flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-row-hover rounded transition-colors ${
  isSelected
    ? "bg-primary/10 font-medium border-l-2 border-primary"
    : ""
}`}

          onClick={() => {
            if (isLeaf) {
              setSearch("");
              setOpen(false);
              onChange({ name: node.name, id: node.code });
            } else {
              toggleNode(node.code);
            }
          }}
        >
          {hasChildren ? (
            <svg
              className={`w-4 h-4 text-muted transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          ) : (
            <div className="w-4"></div>
          )}
          <div
            className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-semibold border ${
              levelColors[node.level - 1] || "bg-gray-100"
            }`}
          >
            {node.level}
          </div>
          <span className="text-sm flex-1 truncate">{node.name}</span>
          {hasChildren && (
            <span className="text-xs text-muted bg-app px-2 py-0.5 rounded-full border border-theme">

              {node.children.length}
            </span>
          )}
        </div>
        {isExpanded && hasChildren && (
          <div className="mt-1 border-l-2 border-theme ml-2">

            {node.children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <span className="font-medium text-muted text-sm">
        {label}
        {USE_DUMMY_DATA && (
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
            DEMO
          </span>
        )}
      </span>
      <div ref={ref} className="relative w-full">
<input
  className="w-full rounded border border-theme bg-card text-main px-3 py-2 text-sm 
  focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"

          placeholder={loading ? "Loading..." : placeholder}
          value={open ? search : displayValue}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          disabled={loading}
        />
        {open && !loading && (
         <div className="absolute left-0 top-full mt-1 w-full bg-card border border-theme shadow-lg rounded z-30 max-h-96 overflow-y-auto">

            <div className="py-2">
              {filteredTree.length > 0 ? (
                filteredTree.map((node) => renderTreeNode(node, 0))
              ) : (
                <div className="px-4 py-8 text-center">
                  <svg
                    className="w-12 h-12 text-muted mx-auto mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <p className="text-muted text-sm">
                    {search ? "No matching items found" : "No items available"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
