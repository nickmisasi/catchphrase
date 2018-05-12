function addTwoNumbers(l1, l2, carry, acc) {
    if (!acc) return addTwoNumbers(l1, l2, 0, []);
    if (!l1 && !l2 && carry === 0) return acc;
    const sum = ((l1 && l1.val) || 0) + ((l2 && l2.val) || 0) + carry;
    return addTwoNumbers((l1 && l1.next), (l2 && l2.next), Math.floor(sum/10), acc.concat(sum % 10));
}