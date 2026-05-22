import SnippetCard from "../functionalElements/SnippetCard";
export default function AllSnippets() {
  return (
    <div className="flex-1 p-[20px] lg:p-[40px]">
      <h3 className="text-[20px] font-semibold">All snippets</h3>
      <div className="w-full flex flex-wrap items-center justify-between mt-4">
        <div className="w-[32%]">
          <SnippetCard
            title="Basic Function"
            description="Some brief and comprehensive description AI will generate..."
            language="C++"
            code={`int main() {
std::string name;
std::cout << "Your name: ";
std::getline(std::cin, name);

int times = 0;
std::cout << "How many times (1-5): ";
if (!(std::cin >> times) || times < 1 || times > 5) {
    std::cerr << "Invalid number.\n";
    return 1;
}

for (int i = 0; i < times; ++i) {
    std::cout << i + 1 << ") Hello, " << name << "\n";
}
}`}
            tags={["C++", "Numbers work", "C++ learning"]}
            onEdit={() => console.log("edit")}
            onDelete={() => console.log("delete")}
          />
        </div>
        <div className="w-[32%]">
          <SnippetCard
            title="Basic Function"
            description="Some brief and comprehensive description AI will generate..."
            language="C++"
            code={`int main() {
std::string name;
std::cout << "Your name: ";
std::getline(std::cin, name);

int times = 0;
std::cout << "How many times (1-5): ";
if (!(std::cin >> times) || times < 1 || times > 5) {
    std::cerr << "Invalid number.\n";
    return 1;
}

for (int i = 0; i < times; ++i) {
    std::cout << i + 1 << ") Hello, " << name << "\n";
}
}`}
            tags={["C++", "Numbers work", "C++ learning"]}
            onEdit={() => console.log("edit")}
            onDelete={() => console.log("delete")}
          />
        </div>
        <div className="w-[32%]">
          <SnippetCard
            title="Basic Function"
            description="Some brief and comprehensive description AI will generate..."
            language="C++"
            code={`int main() {
std::string name;
std::cout << "Your name: ";
std::getline(std::cin, name);

int times = 0;
std::cout << "How many times (1-5): ";
if (!(std::cin >> times) || times < 1 || times > 5) {
    std::cerr << "Invalid number.\n";
    return 1;
}

for (int i = 0; i < times; ++i) {
    std::cout << i + 1 << ") Hello, " << name << "\n";
}
}`}
            tags={["C++", "Numbers work", "C++ learning"]}
            onEdit={() => console.log("edit")}
            onDelete={() => console.log("delete")}
          />
        </div>
      </div>
    </div>
  );
}
