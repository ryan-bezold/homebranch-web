import {useState} from "react";
import {Button, Heading, Loader, Stack} from "@chakra-ui/react";
import {Link, useParams} from "react-router";
import {useGetBookShelfBooksQuery} from "@/entities/bookShelf";
import {LibraryPage} from "@/pages/library";
import type {Route} from "./+types/book-shelf";

export function meta({}: Route.MetaArgs) {
    return [
        {title: "Homebranch - Book Shelf"},
        {name: "description", content: "View books on a shelf"},
    ];
}

export default function BookShelf() {
    const {bookShelfId} = useParams();
    if (!bookShelfId) return null;
    return <BookShelfContent key={bookShelfId} bookShelfId={bookShelfId} />;
}

function BookShelfContent({bookShelfId}: {bookShelfId: string}) {
    const [page, setPage] = useState(0);
    const {data: result, isLoading} = useGetBookShelfBooksQuery({bookShelfId, page});

    if (isLoading) {
        return <Loader />;
    }

    if (!result || result.data.length === 0) {
        return (
            <Stack
                height={"100%"}
                alignItems={"center"}
                justifyContent={"center"}
                gap={4}
            >
                <Heading>This shelf is empty!</Heading>
                <Heading size={"md"}>Add some books to get started.</Heading>
                <Link to={"/"}>
                    <Button>Go to Library</Button>
                </Link>
            </Stack>
        );
    }

    return <LibraryPage result={result} page={page} setPage={setPage} />;
}