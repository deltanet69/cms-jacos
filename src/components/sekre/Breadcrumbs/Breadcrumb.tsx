import Link from "next/link";
interface BreadcrumbProps {
    pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-semibold text-black dark:text-white">
                {pageName}
            </h2>

            <nav>
                <ol className="flex items-center gap-2">
                    <li>
                        <Link className="font text-[#aaaaaa] dark:text-white" href="/sekre">
                            Dashboard /
                        </Link>
                    </li>
                    <li className="font-medium text-[#1F7BC9] dark:text-white">{pageName}</li>
                </ol>
            </nav>
        </div>
    );
};

export default Breadcrumb;
